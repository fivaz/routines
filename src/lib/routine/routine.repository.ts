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
import { Routine, RoutineTime } from '@/lib/routine/routine.type';
import { DB_PATH } from '@/lib/consts';

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

export async function updateTimedRoutines(
	userId: string,
	timedRoutines: Record<RoutineTime, Routine[]>,
) {
	const batch = writeBatch(db);

	Object.entries(timedRoutines).forEach(([time, routines]) => {
		routines.forEach((routine, index) => {
			const routineRef = doc(db, getRoutinePath(userId), routine.id);
			batch.update(routineRef, { order: index, time });
		});
	});

	try {
		await batch.commit();
	} catch (error) {
		console.error('Error in batch update: ', error);
	}
}

export async function generateRoutineImage(
	routineId: string,
	routineName: string,
	tokenId: string,
): Promise<string> {
	const body = {
		routineName,
		routineId,
	};

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-routine-image`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${tokenId}`, // Add Bearer token here
			},
			body: JSON.stringify(body), // Send the body as JSON
		});

		return response.text();
	} catch (error) {
		console.error('Error making POST request:', error);
		return 'error';
	}
}
