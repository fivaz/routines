import { Task } from '@/lib/task/task.type';
import { Session } from '@/lib/session/session.type';

export function getCurrentTotalElapsedTime(sessions: Session[]): number {
	return sessions.reduce(
		(total, session) => total + getDuration(session.startAt, session.endAt),
		0,
	);
}

export function getCurrentSessionDuration(task: Task) {
	const session = task.currentSession;
	if (!session) {
		return 0;
	} else {
		return getDuration(session.startAt, session.endAt);
	}
}

export function getDuration(startAt: string, endAt: string): number {
	try {
		const startDate = new Date(startAt);
		const endDate = endAt ? new Date(endAt) : new Date();
		return Math.abs((endDate.getTime() - startDate.getTime()) / 1000);
	} catch {
		return 0;
	}
}
