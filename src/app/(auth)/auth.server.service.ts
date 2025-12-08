'use server';

import { cookies } from 'next/headers';
import { COOKIE_AUTH_KEY } from '@/app/(auth)/auth.service';

export async function getToken() {
	const cookieStore = await cookies();
	return cookieStore.get(COOKIE_AUTH_KEY)?.value;
}
