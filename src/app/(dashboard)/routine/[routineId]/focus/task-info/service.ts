import { Session } from '@/lib/session/session.type';
import { Task } from '@/lib/task/task.type';
import { getSessionDuration, getTaskSessions } from '@/lib/session/session.utils';

export const getRoutineDelta = (tasks: Task[], sessions: Session[]) => {
	let totalDelta = 0;

	for (const task of tasks) {
		const session = getTaskSessions(sessions, task.id);
		if (!session || !session.startAt || !session.endAt) continue;

		const expectedDuration = task.durationInSeconds;
		const duration = getSessionDuration(session);

		const delta = duration - expectedDuration;
		totalDelta += delta;
	}

	return totalDelta;
};
