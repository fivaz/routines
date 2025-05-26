import * as Sentry from '@sentry/nextjs';

export function safeThrow(error: unknown) {
	if (error instanceof Error) {
		console.error(error);
		Sentry.captureException(error);
	} else {
		console.error(new Error(String(error)));
		Sentry.captureException(new Error(String(error)));
	}
}

export function safeThrowUnauthorized() {
	safeThrow('Error: No authenticated user found');
	return null;
}

export type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
	return arr.length > 0;
}
