import { Session } from '@/lib/session/session.type';
import { differenceInSeconds, parseISO } from 'date-fns';

export function getToday(): string {
	return new Date().toISOString().split('T')[0];
}

export function getSessionDuration(session?: Session): number {
	if (!session?.startAt) return 0;

	const start = parseISO(session.startAt);
	const end = session.endAt ? parseISO(session.endAt) : new Date();
	return differenceInSeconds(end, start);
}

export const getTotalElapsedTime = (sessions: Session[]) =>
	sessions.reduce((total, session) => total + getSessionDuration(session), 0);
