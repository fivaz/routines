// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

if (process.env.NODE_ENV !== 'development') {
	Sentry.init({
		dsn: 'https://bc7b0e0d51b1f8b5c5ebf2042f3d83f9@o4508857555550208.ingest.de.sentry.io/4508857556861008',

		// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
		tracesSampleRate: 1,
		// Enable logs to be sent to Sentry
		enableLogs: true,

		// Enable sending user PII (Personally Identifiable Information)
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
		sendDefaultPii: true,
	});
}
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
