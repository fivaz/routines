import { atom } from 'jotai';
import { Task, tasksAtom } from '@/lib/task/task.type';
import { Session } from '@/lib/session/session.type';

export const elapsedTimeAtom = atom(0);

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
