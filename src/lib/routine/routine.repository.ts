import { DB_PATH } from '@/lib/consts';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
	writeBatch,
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Routine } from '@/lib/routine/routine.type';
import { Task } from '@/lib/task/task.type';
import { getTaskPath } from '@/lib/task/task.repository';
import { sortTasks } from '@/lib/task/task.utils';
import { sortRoutines } from '@/lib/routine/routine.utils';

export function getRoutinePath(userId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}`;
}

export async function addRoutine(userId: string, routine: Routine, imageFile: File | null) {
	const newRoutineRef = doc(collection(db, getRoutinePath(userId)));

	let newRoutine = routine;

	if (imageFile) {
		const imageRef = ref(storage, `${getRoutinePath(userId)}/${newRoutineRef.id}`);

		await uploadBytes(imageRef, imageFile);

		const imageLink = await getDownloadURL(imageRef);

		newRoutine = { ...routine, image: imageLink };
	}

	void setDoc(newRoutineRef, newRoutine);
}

export async function editRoutine(userId: string, routine: Routine, imageFile: File | null) {
	const routineRef = doc(db, getRoutinePath(userId), routine.id);

	let newRoutine = routine;

	if (imageFile) {
		const imageRef = ref(storage, `${getRoutinePath(userId)}/${routineRef.id}`);

		await uploadBytes(imageRef, imageFile);

		const imageLink = await getDownloadURL(imageRef);

		newRoutine = { ...routine, image: imageLink };
	}

	void setDoc(routineRef, newRoutine);
}

export async function getRoutine(userId: string, routineId: string) {
	const data = await getDoc(doc(db, getRoutinePath(userId), routineId));
	return { ...data.data(), id: data.id } as Routine;
}

export function fetchRoutine(
	userId: string,
	routineId: string | string[],
	setRoutine: (routine: Routine) => void,
) {
	const routineRef = doc(db, getRoutinePath(userId), String(routineId));

	return onSnapshot(routineRef, (snapshot) => {
		setRoutine({ ...snapshot.data(), id: snapshot.id } as Routine);
	});
}

export function fetchRoutines(userId: string, setRoutines: (routines: Routine[]) => void) {
	const routinesCollectionRef = collection(db, getRoutinePath(userId));

	return onSnapshot(routinesCollectionRef, (snapshot) => {
		const routines: Routine[] = [];
		snapshot.forEach((doc) => {
			routines.push({ ...doc.data(), id: doc.id } as Task);
		});

		const sortedRoutines = sortRoutines(routines);

		setRoutines(sortedRoutines);
	});
}

export function deleteRoutine(userId: string, routineId: string) {
	deleteDoc(doc(db, getRoutinePath(userId), routineId));
}

export async function updateRoutines(userId: string, routines: Routine[]) {
	const batch = writeBatch(db);

	routines.forEach((routine, index) => {
		const routineRef = doc(db, getRoutinePath(userId), routine.id);
		batch.update(routineRef, { order: index });
	});

	try {
		await batch.commit();
	} catch (error) {
		console.error('Error in batch update: ', error);
	}
}
