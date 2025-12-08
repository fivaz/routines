import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_AUTH_KEY } from '@/app/(auth)/auth.service';
import { Routes } from '@/lib/consts';

const PUBLIC_PATHS = ['/login', '/register', '/api/set-token', '/api/logout'];

const STATIC_PATHS = [
	'/_next/', // Next.js compiled chunks
	'/static/', // static files
	'/favicon.ico', // favicon
	'/manifest.json', // manifest
	'/robots.txt',
];

export function proxy(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

	// Allow Next.js internals and static/public assets
	if (STATIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

	const token = req.cookies.get(COOKIE_AUTH_KEY)?.value;

	if (!token) {
		return NextResponse.redirect(new URL(Routes.LOGIN, req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next|static|favicon.ico).*)'],
};
