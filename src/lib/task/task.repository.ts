import { DB_PATH } from '@/lib/consts';
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	setDoc,
	writeBatch,
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Task } from '@/lib/task/task.type';
import { generateImage } from '@/app/(dashboard)/routine/[routineId]/actions';
import { Routine } from '@/lib/routine/routine.type';
import { getRoutinePath } from '@/lib/routine/routine.repository';

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

async function convertImageUrlToBlob(imageUrl: string) {
	const response = await fetch(imageUrl);
	return await response.blob();
}

async function getGeneratedImageFile(taskName: string) {
	const temporaryImageUrl = await generateImage(taskName);

	return convertImageUrlToBlob(temporaryImageUrl);
}

async function handleTaskImage(
	userId: string,
	routineId: string,
	taskId: string,
	imageFile: File | null,
	task: Task,
): Promise<string> {
	try {
		if (imageFile) {
			return await getImageUrl(userId, routineId, taskId, imageFile);
		} else {
			const blob = await getGeneratedImageFile(task.name);
			return await getImageUrl(userId, routineId, taskId, blob);
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

export async function addTask(
	userId: string,
	routineId: string,
	task: Task,
	imageFile: File | null,
): Promise<TaskOperationResult> {
	// try {
	const newTaskRef = doc(collection(db, getTaskPath(userId, routineId)));
	const taskId = newTaskRef.id;

	// Handle image
	const image = await handleTaskImage(userId, routineId, taskId, imageFile, task);
	const newTask = { ...task, id: taskId, image };

	// Update task and routine summary in a transaction
	await runTransaction(db, async (transaction) => {
		const routineRef = doc(db, getRoutinePath(userId), routineId);
		const routineDoc = await transaction.get(routineRef);

		// Add the task
		transaction.set(newTaskRef, newTask);

		// Update routine summary
		if (routineDoc.exists()) {
			const currentTaskCount = (routineDoc.data() as Routine).taskCount || 0;
			const currentDuration = (routineDoc.data() as Routine).totalDuration || 0;

			transaction.update(routineRef, {
				taskCount: currentTaskCount + 1,
				totalDuration: currentDuration + (task.durationInSeconds || 0),
				lastUpdated: serverTimestamp(),
			});
		}
	});

	return { success: true, task: newTask };
	// } catch (error) {
	// 	console.error('Error adding task:', error);
	// 	return { success: false, error: error as Error };
	// }
}

export async function editTask(
	userId: string,
	routineId: string,
	task: Task,
	imageFile: File | null,
	newRoutineId: string,
): Promise<TaskOperationResult> {
	try {
		let updatedTask = task;

		// Handle image if needed
		if (imageFile) {
			await deleteImage(userId, routineId, task.id);
			const image = await handleTaskImage(userId, routineId, task.id, imageFile, task);
			updatedTask = { ...task, image };
		}

		// If moving to a different routine
		if (routineId !== newRoutineId) {
			await runTransaction(db, async (transaction) => {
				// Update old routine summary
				const oldRoutineRef = doc(db, getRoutinePath(userId), routineId);
				const oldRoutineDoc = await transaction.get(oldRoutineRef);

				if (oldRoutineDoc.exists()) {
					const oldTaskCount = (oldRoutineDoc.data() as Routine).taskCount || 0;
					const oldDuration = (oldRoutineDoc.data() as Routine).totalDuration || 0;

					transaction.update(oldRoutineRef, {
						taskCount: Math.max(0, oldTaskCount - 1),
						totalDuration: Math.max(0, oldDuration - (task.durationInSeconds || 0)),
						lastUpdated: serverTimestamp(),
					});
				}

				// Update new routine summary
				const newRoutineRef = doc(db, getRoutinePath(userId), newRoutineId);
				const newRoutineDoc = await transaction.get(newRoutineRef);

				if (newRoutineDoc.exists()) {
					const newTaskCount = (oldRoutineDoc.data() as Routine).taskCount || 0;
					const newDuration = (oldRoutineDoc.data() as Routine).totalDuration || 0;

					transaction.update(newRoutineRef, {
						taskCount: newTaskCount + 1,
						totalDuration: newDuration + (task.durationInSeconds || 0),
						lastUpdated: serverTimestamp(),
					});
				}

				// Move the task
				const oldTaskRef = doc(db, getTaskPath(userId, routineId), task.id);
				const newTaskRef = doc(db, getTaskPath(userId, newRoutineId), task.id);

				transaction.delete(oldTaskRef);
				transaction.set(newTaskRef, updatedTask);
			});
		} else {
			// Same routine, but need to check if duration changed
			await runTransaction(db, async (transaction) => {
				// Get the existing task to compare duration
				const taskRef = doc(db, getTaskPath(userId, routineId), task.id);
				const taskDoc = await transaction.get(taskRef);

				if (taskDoc.exists()) {
					const oldTask = taskDoc.data() as Task;
					const oldDuration = oldTask.durationInSeconds || 0;
					const newDuration = updatedTask.durationInSeconds || 0;

					// If duration changed, update routine summary
					if (oldDuration !== newDuration) {
						const routineRef = doc(db, getRoutinePath(userId), routineId);
						const routineDoc = await transaction.get(routineRef);

						if (routineDoc.exists()) {
							const currentTotalDuration = (routineDoc.data() as Routine).totalDuration || 0;
							const durationDiff = newDuration - oldDuration;

							transaction.update(routineRef, {
								totalDuration: currentTotalDuration + durationDiff,
								lastUpdated: serverTimestamp(),
							});
						}
					}
				}

				// Update the task
				transaction.set(taskRef, updatedTask);
			});
		}

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

			// Update routine summary
			const routineRef = doc(db, getRoutinePath(userId), routineId);
			const routineDoc = await transaction.get(routineRef);

			if (routineDoc.exists()) {
				const currentTaskCount = (routineDoc.data() as Routine).taskCount || 0;
				const currentDuration = (routineDoc.data() as Routine).totalDuration || 0;

				transaction.update(routineRef, {
					taskCount: Math.max(0, currentTaskCount - 1),
					totalDuration: Math.max(0, currentDuration - (taskData.durationInSeconds || 0)),
					lastUpdated: serverTimestamp(),
				});
			}

			// Delete the task
			transaction.delete(taskRef);

			// Delete the image
			await deleteImage(userId, routineId, taskId);
		});

		return { success: true };
	} catch (error) {
		console.error('Error deleting task:', error);
		return { success: false, error: error as Error };
	}
}

function deleteImage(userId: string, routineId: string, taskId: string) {
	const imageRef = getImageRef(userId, routineId, taskId);

	return deleteObject(imageRef);
}

export async function reorderTasks(userId: string, routineId: string, tasks: Task[]) {
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
