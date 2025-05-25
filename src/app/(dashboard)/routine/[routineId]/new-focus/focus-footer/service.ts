import { Session } from '@/lib/session/session.type';
import { Task } from '@/lib/task/task.type';

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

export const getRoutineDelta = (tasks: Task[], sessions: Session[]) => {
	let totalDelta = 0;

	for (const task of tasks) {
		const session = sessions.find((s) => s.taskId === task.id);
		if (!session || !session.startAt || !session.endAt) continue;

		const start = new Date(session.startAt).getTime();
		const end = new Date(session.endAt).getTime();

		const actualDuration = (end - start) / 1000; // in seconds
		const expectedDuration = task.durationInSeconds;

		const delta = actualDuration - expectedDuration;
		totalDelta += delta;
	}

	return totalDelta;
};
