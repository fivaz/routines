import { cookies } from 'next/headers';
import { COOKIE_AUTH_KEY } from '@/app/(auth)/auth.service';

export async function POST() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_AUTH_KEY);

	return Response.json({ success: true });
}
