import { DB_PATH } from '@/lib/consts';
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	writeBatch,
} from 'firebase/firestore';
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
	console.log('fetchRoutines');
	const routinesCollectionRef = query(collection(db, getRoutinePath(userId)), orderBy('order'));

	return onSnapshot(routinesCollectionRef, (snapshot) => {
		const routines: Routine[] = [];
		snapshot.forEach((doc) => {
			routines.push({ ...doc.data(), id: doc.id } as Routine);
		});

		setRoutines(routines);
	});
}

export function deleteRoutine(userId: string, routineId: string) {
	deleteDoc(doc(db, getRoutinePath(userId), routineId));
}

export async function reorderRoutines(userId: string, routines: Routine[]) {
	const batch = writeBatch(db);

	routines.forEach((routine, index) => {
		console.log('routine.name', routine.name, index, routine.order);
		const routineRef = doc(db, getRoutinePath(userId), routine.id);
		batch.update(routineRef, { order: index });
	});

	try {
		await batch.commit();
	} catch (error) {
		console.error('Error in batch update: ', error);
	}
}
