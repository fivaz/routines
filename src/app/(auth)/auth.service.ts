import { UserCredential } from 'firebase/auth';
import { Routes } from '@/lib/consts';

export async function authServer(credential: UserCredential) {
	const idToken = await credential.user.getIdToken();

	await fetch('/api/login', {
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	});

	window.location.href = Routes.ROOT;
}
