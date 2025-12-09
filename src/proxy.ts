import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/auth/firebase-admin';
import { Routes, SESSION_COOKIE } from '@/lib/const';

const PUBLIC_PATHS = ['/login', '/register'];

export async function proxy(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

	const token = req.cookies.get(SESSION_COOKIE)?.value;

	if (!token) return NextResponse.redirect(new URL(Routes.LOGIN, req.url));

	try {
		await adminAuth.verifySessionCookie(token, true);
		return NextResponse.next();
	} catch (error) {
		return NextResponse.redirect(new URL(Routes.LOGIN, req.url));
	}
}

export const config = {
	matcher: '/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest).*)',
};
