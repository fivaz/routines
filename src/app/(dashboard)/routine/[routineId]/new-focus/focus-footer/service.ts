import { Session } from '@/lib/session/session.type';
import { Task } from '@/lib/task/task.type';

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
