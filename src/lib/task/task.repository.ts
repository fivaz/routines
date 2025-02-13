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
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Task } from '@/lib/task/task.type';
import { generateImage } from '@/app/(dashboard)/routine/[routineId]/actions';

export function getTaskPath(userId: string, routineId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}/${routineId}/${DB_PATH.TASKS}`;
}

export function fetchTasks(userId: string, routineId: string, setTasks: (tasks: Task[]) => void) {
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
) {
	const taskRef = doc(db, getTaskPath(userId, routineId), task.id);

	let newTask = task;

	if (imageFile) {
		// TODO remove current image
		const image = await getImageUrl(userId, routineId, taskRef.id, imageFile);

		newTask = { ...task, image };
	}

	void setDoc(taskRef, newTask);
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
