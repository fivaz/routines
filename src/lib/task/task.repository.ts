import { DB_PATH } from '@/lib/consts';
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Task } from '@/lib/task/task.type';
import { getRoutinePath } from '@/lib/routine/routine.repository';
import { Dispatch, SetStateAction } from 'react';

export function getTaskPath(userId: string, routineId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}/${routineId}/${DB_PATH.TASKS}`;
}

export function fetchTasks(
	userId: string,
	routineId: string,
	setTasks: Dispatch<SetStateAction<Task[]>>,
) {
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

export async function getTask(userId: string, routineId: string, taskId: string) {
	const data = await getDoc(doc(db, getTaskPath(userId, routineId), taskId));
	return { ...data.data(), id: data.id } as Task;
}

export function deleteTask(userId: string, routineId: string, taskId: string) {
	deleteDoc(doc(db, getTaskPath(userId, routineId), taskId));
}
