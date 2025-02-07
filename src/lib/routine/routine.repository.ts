import { DB_PATH } from '@/lib/consts';
import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Routine } from '@/lib/routine/routine.type';

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

	setDoc(newRoutineRef, newRoutine);
}

export async function getRoutine(userId: string, routineId: string) {
	const data = await getDoc(doc(db, getRoutinePath(userId), routineId));
	return { ...data.data(), id: data.id } as Routine;
}

export function deleteRoutine(userId: string, routineId: string) {
	deleteDoc(doc(db, getRoutinePath(userId), routineId));
}
