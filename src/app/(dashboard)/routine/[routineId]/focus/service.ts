import { atom } from 'jotai';
import { Task, tasksAtom } from '@/lib/task/task.type';
import { dateAtom, Session } from '@/lib/session/session.type';
import {
	getSessionsDuration,
	getTaskSessions,
	getTotalElapsedTime,
} from '@/lib/session/session.utils';
import { getCurrentRoutineExpectedTime, getRoutineExpectedTime } from '@/lib/task/task.utils';
import { atomEffect } from 'jotai-effect';
import { currentUserAtom } from '@/lib/user/user.type';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { fetchSessionsByDate } from '@/lib/session/session.repository';

// current index of tasks in the focus page
export const taskIndexAtom = atom(0);

// current task selected
export const currentTaskAtom = atom<Task | undefined>((get) => {
	const index = get(taskIndexAtom);
	const tasks = get(tasksAtom);
	return tasks[index];
});

// sessions of the current task
export const currentSessionsAtom = atom<Session[]>([]);

export const currentTaskSessionsAtom = atom((get) => {
	const task = get(currentTaskAtom);
	const sessions = get(currentSessionsAtom);
	return getTaskSessions(sessions, task?.id);
});

// variable to control the update of the time in the focus page
export const tickAtom = atom(0);

let interval: NodeJS.Timeout | null = null;

tickAtom.onMount = (set) => {
	interval = setInterval(() => {
		set((prev) => prev + 1); // just triggers a re-evaluation
	}, 1000);

	return () => clearInterval(interval!);
};

// current time spent in the current task
export const currentElapsedTimeAtom = atom((get) => {
	get(tickAtom); // ensures re-eval every second

	const sessions = get(currentTaskSessionsAtom);
	return getSessionsDuration(sessions);
});

// current time spent in the routine
export const totalElapsedTimeAtom = atom((get) => {
	get(tickAtom); // re-eval every second

	const sessions = get(currentSessionsAtom);
	return getTotalElapsedTime(sessions);
});

// difference between the expected time for the routine, and the current time spent, based only on the current tasks accomplished
export const currentRoutineDeltaAtom = atom((get) => {
	const totalElapsed = get(totalElapsedTimeAtom);
	const sessions = get(currentSessionsAtom);
	const tasks = get(tasksAtom);
	const expectedTotal = getCurrentRoutineExpectedTime(tasks, sessions);
	return totalElapsed - expectedTotal;
});

// difference between the expected time for the routine, and the current time spent, based only on all tasks of the routine
export const routineDeltaAtom = atom((get) => {
	const totalElapsed = get(totalElapsedTimeAtom);
	const tasks = get(tasksAtom);

	const expectedTotal = getRoutineExpectedTime(tasks);

	return totalElapsed - expectedTotal;
});

// sessions of a given date, routine and tasks
export const currentSessionsAtomEffect = atomEffect((get, set) => {
	const date = get(dateAtom);
	const tasks = get(tasksAtom);
	const user = get(currentUserAtom);
	const routineId = get(routineIdAtom);

	if (!user?.uid || tasks.length === 0 || !routineId) {
		set(currentSessionsAtom, []);
		return;
	}

	const unsubscribe = fetchSessionsByDate({
		userId: user.uid,
		routineId,
		tasks,
		date,
		setSessions: (sessions) => set(currentSessionsAtom, sessions),
	});

	return () => unsubscribe();
});
