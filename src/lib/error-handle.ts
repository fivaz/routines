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
	safeThrow('No authenticated user found');
	return null;
}
