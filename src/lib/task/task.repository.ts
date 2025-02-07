import { DB_PATH } from '@/lib/consts';
import {
	collection,
	updateDoc,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
	writeBatch,
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Task } from '@/lib/task/task.type';
import { getRoutinePath } from '@/lib/routine/routine.repository';
import { Dispatch, SetStateAction } from 'react';
import { Routine } from '@/lib/routine/routine.type';

export function getTaskPath(userId: string, routineId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}/${routineId}/${DB_PATH.TASKS}`;
}

export function fetchTasks(userId: string, routineId: string, setTasks: (tasks: Task[]) => void) {
	const tasksCollectionRef = collection(db, getTaskPath(userId, routineId));

	return onSnapshot(tasksCollectionRef, (snapshot) => {
		const tasks: Task[] = [];
		snapshot.forEach((doc) => {
			tasks.push({ ...doc.data(), id: doc.id } as Task);
		});

		setTasks(tasks);
	});
}

export async function addTask(
	userId: string,
	routineId: string,
	task: Task,
	imageFile: File | null,
) {
	const newTaskRef = doc(collection(db, getTaskPath(userId, routineId)));

	let newTask = task;

	if (imageFile) {
		const imageRef = ref(storage, `${getTaskPath(userId, routineId)}/${newTaskRef.id}`);

		await uploadBytes(imageRef, imageFile);

		const imageLink = await getDownloadURL(imageRef);

		newTask = { ...task, image: imageLink };
	}

	setDoc(newTaskRef, newTask);
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
		const imageRef = ref(storage, `${getTaskPath(userId, routineId)}/${taskRef.id}`);

		await uploadBytes(imageRef, imageFile);

		const imageLink = await getDownloadURL(imageRef);

		newTask = { ...task, image: imageLink };
	}

	setDoc(taskRef, newTask);
}

export async function getTask(userId: string, routineId: string, taskId: string) {
	const data = await getDoc(doc(db, getTaskPath(userId, routineId), taskId));
	return { ...data.data(), id: data.id } as Task;
}

export function deleteTask(userId: string, routineId: string, taskId: string) {
	deleteDoc(doc(db, getTaskPath(userId, routineId), taskId));
}

export async function updateTasks(userId: string, routineId: string, tasks: Task[]) {
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
