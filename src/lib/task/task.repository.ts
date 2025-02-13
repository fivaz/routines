import { DB_PATH } from '@/lib/consts';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	writeBatch,
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Task } from '@/lib/task/task.type';
import { generateImage } from '@/app/(dashboard)/routine/[routineId]/actions';

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

export async function addTask(
	userId: string,
	routineId: string,
	task: Task,
	imageFile: File | null,
) {
	const newTaskRef = doc(collection(db, getTaskPath(userId, routineId)));

	let blob: Blob | null = imageFile;

	if (!blob) {
		blob = await getGeneratedImageFile(task.name);
	}

	const image = await getImageUrl(userId, routineId, newTaskRef.id, blob);

	const newTask = { ...task, image };

	void setDoc(newTaskRef, newTask);
}

export async function editTask(
	userId: string,
	routineId: string,
	task: Task,
	imageFile: File | null,
	newRoutineId: string,
) {
	try {
		let newTask = task;

		if (imageFile) {
			deleteImage(userId, routineId, task.id);
			const image = await getImageUrl(userId, routineId, task.id, imageFile);

			newTask = { ...task, image };
		}

		// If routine ID is different, move the task
		if (routineId !== newRoutineId) {
			// Delete from old routine
			const oldTaskRef = doc(db, getTaskPath(userId, routineId), task.id);
			await deleteDoc(oldTaskRef);

			// Create in new routine
			const newTaskRef = doc(db, getTaskPath(userId, newRoutineId), task.id);
			await setDoc(newTaskRef, newTask);

			// If there was an image, you might need to move it in storage as well
			// This depends on how your storage paths are structured
		} else {
			// Just update the existing task
			const taskRef = doc(db, getTaskPath(userId, routineId), task.id);
			await setDoc(taskRef, newTask);
		}
	} catch (error) {
		console.error('Error editing/moving task:', error);
		throw error;
	}
}

function deleteImage(userId: string, routineId: string, taskId: string) {
	const imageRef = getImageRef(userId, routineId, taskId);

	return deleteObject(imageRef);
}

export async function getTask(userId: string, routineId: string, taskId: string) {
	const data = await getDoc(doc(db, getTaskPath(userId, routineId), taskId));
	return { ...data.data(), id: data.id } as Task;
}

export function deleteTask(userId: string, routineId: string, taskId: string) {
	deleteDoc(doc(db, getTaskPath(userId, routineId), taskId));
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
