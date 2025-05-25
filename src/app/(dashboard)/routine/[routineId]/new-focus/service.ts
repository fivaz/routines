import { atom } from 'jotai';
import { Task, tasksAtom } from '@/lib/task/task.type';
import { Session } from '@/lib/session/session.type';
import { getSessionDuration, getTotalElapsedTime } from '@/lib/session/session.utils';

export const taskIndexAtom = atom(0);

export const currentTaskAtom = atom<Task | undefined>((get) => {
	const index = get(taskIndexAtom);
	const tasks = get(tasksAtom);
	return tasks[index];
});

export const sessionsAtom = atom<Session[]>([]);

export const currentSessionAtom = atom((get) => {
	const task = get(currentTaskAtom);
	const sessions = get(sessionsAtom);
	return sessions.find((session) => session.taskId === task?.id);
});

export const tickAtom = atom(0);

let interval: NodeJS.Timeout | null = null;

tickAtom.onMount = (set) => {
	interval = setInterval(() => {
		set((prev) => prev + 1); // just triggers a re-evaluation
	}, 1000);

	return () => clearInterval(interval!);
};

export const currentElapsedTimeAtom = atom((get) => {
	get(tickAtom); // ensures re-eval every second

	const session = get(currentSessionAtom);
	return getSessionDuration(session);
});

export const totalElapsedTimeAtom = atom((get) => {
	get(tickAtom); // re-eval every second

	const sessions = get(sessionsAtom);
	return getTotalElapsedTime(sessions);
});

export const routineDeltaAtom = atom((get) => {
	const totalElapsed = get(totalElapsedTimeAtom);
	const sessions = get(sessionsAtom);
	const tasks = get(tasksAtom);

	const expectedTotal = sessions.reduce((sum, session) => {
		const task = tasks.find((t) => t.id === session.taskId);
		if (!task) return sum;
		return sum + task.durationInSeconds;
	}, 0);

	return totalElapsed - expectedTotal;
});
