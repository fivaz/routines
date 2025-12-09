'use server';

import { adminAuth } from '@/lib/auth/firebase-admin';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/const';

export async function getToken() {
	const cookieStore = await cookies();

	return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function loginServer(idToken: string) {
	// Create a session cookie valid for 14 days
	const expiresIn = 14 * 24 * 60 * 60 * 1000;

	const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

	(await cookies()).set(SESSION_COOKIE, sessionCookie, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: expiresIn / 1000,
	});
}

export async function logoutAction() {
	(await cookies()).delete(SESSION_COOKIE);
}
