import { Session } from '@/lib/session/session.type';
import { Task } from '@/lib/task/task.type';
import { getSessionsDuration, getTaskSessions } from '@/lib/session/session.utils';

export const getRoutineDelta = (tasks: Task[], sessions: Session[]) => {
	let totalDelta = 0;

	for (const task of tasks) {
		const session = getTaskSessions(sessions, task.id);

		const expectedDuration = task.durationInSeconds;
		const duration = getSessionsDuration(session);

		const delta = duration - expectedDuration;
		totalDelta += delta;
	}

	return totalDelta;
};
