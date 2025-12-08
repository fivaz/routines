import { signOut, UserCredential } from 'firebase/auth';
import { Routes } from '@/lib/consts';
import { auth } from '@/lib/firebase';

export const COOKIE_AUTH_KEY = process.env.AUTH_COOKIE_NAME || 'auth_token';

export async function authServer(credential: UserCredential) {
	const token = await credential.user.getIdToken();

	await fetch('/api/set-token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});

	window.location.href = Routes.ROOT;
}

export async function logOutServer() {
	await signOut(auth);
	await fetch('/api/logout', { method: 'POST' });

	window.location.href = Routes.ROOT;
}
