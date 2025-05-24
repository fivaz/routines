import { Session } from '@/lib/session/session.type';

export function getCurrentTotalElapsedTime(sessions: Session[]): number {
	return sessions.reduce((total, session) => total + getSessionDuration(session), 0);
}

export function getSessionDuration(session?: Session): number {
	if (!session || !session.startAt) {
		return 0;
	}
	try {
		const startDate = new Date(session.startAt);
		const endDate = session.endAt ? new Date(session.endAt) : new Date();
		return Math.abs((endDate.getTime() - startDate.getTime()) / 1000);
	} catch {
		return 0;
	}
}
