import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/lib/auth/firebase';
import { DB_PATH } from '@/lib/const';

export async function createUserInDB(
	userId: string,
	displayName: string,
	email: string,
	photoURL: string,
) {
	const userRef = doc(db, DB_PATH.USERS, userId);

	await setDoc(userRef, {
		displayName,
		email,
		photoURL,
	});
}

export async function storeAvatar(userId: string, file: Blob): Promise<string> {
	const avatarsRef = ref(storage, `${DB_PATH.USERS}/${userId}`);
	await uploadBytes(avatarsRef, file);
	return getDownloadURL(avatarsRef);
}
