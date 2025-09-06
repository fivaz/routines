import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, redirectToHome, redirectToLogin } from 'next-firebase-auth-edge';
import { serverConfig } from '@/lib/config';

const PUBLIC_PATHS = ['/register', '/login', '/login2', '/register2'];

export async function middleware(request: NextRequest) {
	return authMiddleware(request, {
		loginPath: '/api/login',
		logoutPath: '/api/logout',
		refreshTokenPath: '/api/refresh-token',
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		cookieName: serverConfig.cookieName,
		cookieSignatureKeys: serverConfig.cookieSignatureKeys,
		cookieSerializeOptions: serverConfig.cookieSerializeOptions,
		serviceAccount: serverConfig.serviceAccount,
		handleValidToken: async (_, headers) => {
			if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
				return redirectToHome(request);
			}

			return NextResponse.next({
				request: {
					headers,
				},
			});
		},
		handleInvalidToken: async (reason) => {
			console.info('Missing or malformed credentials', { reason });

			return redirectToLogin(request, {
				path: '/login',
				publicPaths: PUBLIC_PATHS,
			});
		},
		handleError: async (error) => {
			console.error('Unhandled authentication error', { error });

			return redirectToLogin(request, {
				path: '/login',
				publicPaths: PUBLIC_PATHS,
			});
		},
	});
}

export const config = {
	matcher: ['/', '/((?!_next|api|.*\\.).*)', '/api/login', '/api/logout', '/api/refresh-token'],
};
