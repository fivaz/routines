import { getTokens, Tokens } from 'next-firebase-auth-edge';
import { NextRequest } from 'next/server';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export type ServerConfig = {
	cookieName: string;
	cookieSignatureKeys: string[];
	cookieSerializeOptions: {
		path: string;
		httpOnly: boolean;
		secure: boolean;
		sameSite: 'lax' | 'strict' | 'none';
		maxAge: number;
	};
	serviceAccount: {
		projectId: string;
		clientEmail: string;
		privateKey: string;
	};
};

export const serverConfig: ServerConfig = {
	cookieName: process.env.AUTH_COOKIE_NAME,
	cookieSignatureKeys: [
		process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT,
		process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS,
	],
	cookieSerializeOptions: {
		path: '/',
		httpOnly: true,
		secure: process.env.USE_SECURE_COOKIES === 'true',
		sameSite: 'lax' as const,
		maxAge: 12 * 60 * 60 * 24,
	},
	serviceAccount: {
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	},
};

export const tokenConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	cookieName: serverConfig.cookieName,
	cookieSignatureKeys: serverConfig.cookieSignatureKeys,
	serviceAccount: serverConfig.serviceAccount,
};

export async function getUserTokens(cookies: ReadonlyRequestCookies): Promise<Tokens | null> {
	return getTokens(cookies, tokenConfig);
}
