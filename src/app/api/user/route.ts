import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/auth/firebase-admin';
import { SESSION_COOKIE } from '@/lib/const';

export async function GET() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

	if (!sessionCookie) {
		return Response.json({ user: null }, { status: 200 });
	}

	try {
		const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
		const user = {
			uid: decodedToken.uid,
			name: decodedToken.name,
			email: decodedToken.email,
			picture: decodedToken.picture,
		};
		return Response.json({ user }, { status: 200 });
	} catch {
		return Response.json({ user: null }, { status: 200 });
	}
}
