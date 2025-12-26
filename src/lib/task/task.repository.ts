import { DB_PATH } from '@/lib/const';
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	setDoc,
	Transaction,
	writeBatch,
} from 'firebase/firestore';
import { db, storage } from '@/lib/auth/firebase';
import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytes } from 'firebase/storage';
import { ImageFocus, Task } from '@/lib/task/task.type';
import { getRoutinePath } from '@/lib/routine/routine.repository';
import { FirebaseError } from 'firebase/app';
import { generateTaskImage } from '@/app/(dashboard)/routine/action';

export function getTaskPath(userId: string, routineId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}/${routineId}/${DB_PATH.TASKS}`;
}

export function fetchTasks(userId: string, routineId: string, setTasks: (tasks: Task[]) => void) {
	console.log('fetchTasks');

	const tasksCollectionRef = query(
		collection(db, getTaskPath(userId, routineId)),
		orderBy('order'),
	);

	return onSnapshot(tasksCollectionRef, (snapshot) => {
		const tasks: Task[] = [];
		snapshot.forEach((doc) => {
			tasks.push({ ...doc.data(), id: doc.id } as Task);
		});

		setTasks(tasks);
	});
}

function getImageRef(userId: string, routineId: string, taskId: string) {
	return ref(storage, `${getTaskPath(userId, routineId)}/${taskId}`);
}

async function getImageUrl(userId: string, routineId: string, taskId: string, imageBlob: Blob) {
	const imageRef = getImageRef(userId, routineId, taskId);

	await uploadBytes(imageRef, imageBlob);

	return await getDownloadURL(imageRef);
}

async function handleTaskImage({
	userId,
	routineId,
	taskId,
	taskName,
	imageFile,
	focus,
}: {
	userId: string;
	routineId: string;
	taskId: string;
	taskName: string;
	imageFile: File | null;
	focus: ImageFocus;
}): Promise<string> {
	try {
		if (imageFile) {
			return await getImageUrl(userId, routineId, taskId, imageFile);
		} else {
			return generateTaskImage({ routineId, taskId, taskName, focus });
		}
	} catch (error) {
		console.error('Error handling task image:', error);
		throw error;
	}
}

interface TaskOperationResult {
	success: boolean;
	error?: Error;
	task?: Task;
}

export async function addTask({
	userId,
	routineId,
	task,
	imageFile,
	focus,
}: {
	userId: string;
	routineId: string;
	task: Omit<Task, 'id'>;
	imageFile: File | null;
	focus: ImageFocus;
}): Promise<TaskOperationResult> {
	try {
		const newTaskRef = doc(collection(db, getTaskPath(userId, routineId)));
		const taskId = newTaskRef.id;

		// Handle image
		const image = await handleTaskImage({
			userId,
			routineId,
			taskId: taskId,
			taskName: task.name,
			imageFile,
			focus,
		});

		const newTask = { ...task, id: taskId, image };
		// const newTask = { ...task, id: taskId };

		// Update task and routine summary in a transaction
		await runTransaction(db, async (transaction) => {
			// Add the task
			transaction.set(newTaskRef, newTask);

			// TODO sum the value of taskCount and taskDuration everytime instead of just getting the difference when something is deleted
		});

		return { success: true };
	} catch (error) {
		console.error('Error adding task:', error);
		return { success: false, error: error as Error };
	}
}

async function handleTaskImageUpdate(
	userId: string,
	routineId: string,
	newRoutineId: string,
	task: Task,
	imageFile: File | null,
): Promise<Task> {
	if (!imageFile) return task;

	if (task.image && !task.image.startsWith('https://storage.googleapis.com/')) {
		await deleteImage(userId, routineId, task.id);
	}

	const image = await getImageUrl(userId, newRoutineId, task.id, imageFile);

	return { ...task, image };
}

async function updateRoutineIfDurationChanged(
	transaction: Transaction,
	userId: string,
	routineId: string,
	oldTask: Task | null,
	newTask: Task,
) {
	if (!oldTask) return;

	const oldDuration = oldTask.durationInSeconds ?? 0;
	const newDuration = newTask.durationInSeconds ?? 0;

	if (oldDuration !== newDuration) {
		const routineRef = doc(db, getRoutinePath(userId), routineId);
		transaction.update(routineRef, {
			lastUpdated: serverTimestamp(),
		});
	}
}

async function editTaskTransaction(
	transaction: Transaction,
	userId: string,
	routineId: string,
	newRoutineId: string,
	task: Task,
) {
	const oldTaskRef = doc(db, getTaskPath(userId, routineId), task.id);
	const newTaskRef = doc(db, getTaskPath(userId, newRoutineId), task.id);

	if (routineId === newRoutineId) {
		const taskDoc = await transaction.get(oldTaskRef);
		const oldTask = taskDoc.exists() ? (taskDoc.data() as Task) : null;

		await updateRoutineIfDurationChanged(transaction, userId, routineId, oldTask, task);

		transaction.set(oldTaskRef, task);
	} else {
		transaction.delete(oldTaskRef);
		transaction.set(newTaskRef, task);
	}
}

type EditTaskArgs = {
	userId: string;
	routineId: string;
	newRoutineId: string;
	imageFile: File | null;
	task: Task;
};

export async function editTask(args: EditTaskArgs): Promise<TaskOperationResult> {
	try {
		const updatedTask = await handleTaskImageUpdate(
			args.userId,
			args.routineId,
			args.newRoutineId,
			args.task,
			args.imageFile,
		);

		await runTransaction(db, (transaction) =>
			editTaskTransaction(transaction, args.userId, args.routineId, args.newRoutineId, updatedTask),
		);

		return { success: true, task: updatedTask };
	} catch (error) {
		console.error('Error editing task:', error);
		return { success: false, error: error as Error };
	}
}

export async function deleteTask(
	userId: string,
	routineId: string,
	taskId: string,
): Promise<TaskOperationResult> {
	try {
		await runTransaction(db, async (transaction) => {
			// Get the task to know its duration
			const taskRef = doc(db, getTaskPath(userId, routineId), taskId);
			const taskDoc = await transaction.get(taskRef);

			if (!taskDoc.exists()) {
				throw new Error('Task not found');
			}

			const taskData = taskDoc.data() as Task;

			// Delete the task
			transaction.delete(taskRef);

			// Delete the image
			if (taskData.image) {
				await deleteImage(userId, routineId, taskId);
			}
		});

		return { success: true };
	} catch (error) {
		console.error('Error deleting task:', error);
		return { success: false, error: error as Error };
	}
}

async function deleteImage(userId: string, routineId: string, taskId: string) {
	const imageRef = getImageRef(userId, routineId, taskId);

	try {
		// Check if the file exists first by getting its metadata
		await getMetadata(imageRef);

		// If we get here, the file exists and we can delete it
		await deleteObject(imageRef);
		console.log(`Successfully deleted image for task ${taskId}`);
	} catch (error) {
		// Check if the error is because the file doesn't exist
		if ((error as FirebaseError).code === 'storage/object-not-found') {
			console.log(
				`No image found for task in ${getTaskPath(userId, routineId)}/${taskId}, nothing to delete`,
			);
			return;
		}
		// Re-throw any other errors
		throw error;
	}
}

export async function updateTasksOrder(userId: string, routineId: string, tasks: Task[]) {
	const batch = writeBatch(db);

	tasks.forEach((task, index) => {
		const taskRef = doc(db, getTaskPath(userId, routineId), task.id);
		batch.update(taskRef, { order: index });
	});

	try {
		await batch.commit();
	} catch (error) {
		console.error('Error in batch update: ', error);
	}
}

export async function persistTask(userId: string, routineId: string, task: Task) {
	const taskRef = doc(db, getTaskPath(userId, routineId), task.id);

	setDoc(taskRef, task);
}
