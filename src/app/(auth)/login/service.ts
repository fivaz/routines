import { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserInDB, storeAvatar } from '@/lib/user/user.repository';

export function checkEmail(email: string): boolean {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function validateFields(email: string, password: string): string {
	if (!email) {
		return 'Email is required';
	}
	if (!checkEmail(email)) {
		return 'Invalid email address';
	}
	if (!password) {
		return 'Password is required';
	}

	return '';
}

export function parseErrors(error: unknown) {
	if (error instanceof FirebaseError) {
		if (error.code === 'auth/invalid-credential') {
			return 'login or password are incorrect';
		} else if (error.code === 'auth/network-request-failed') {
			return "you can't login if you're not connected to the internet";
		} else if (error.code === 'auth/weak-password') {
			return 'password should be at least 6 characters';
		} else if (error.code === 'auth/popup-closed-by-user') {
			return 'the pop up was closed, try again';
		} else {
			console.error(error.message);
			return error.message;
		}
	} else {
		console.error(error);
		return 'Unexpected error';
	}
}

export async function register(
	displayName: string,
	email: string,
	password: string,
	avatar: string,
) {
	const { user } = await createUserWithEmailAndPassword(auth, email, password);

	return createUser(user, displayName, email, avatar);
}

export async function createUser(user: User, displayName: string, email: string, avatar: string) {
	const photoURL = await storeAvatar(
		user.uid,
		new Blob([avatar], { type: 'image/svg+xml;charset=utf-8' }),
	);

	await updateProfile(user, { displayName, photoURL });

	await createUserInDB(user.uid, displayName, email, photoURL);
}
