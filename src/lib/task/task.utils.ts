import { intervalToDuration } from 'date-fns';
import { Task } from '@/lib/task/task.type';
import { Session } from '@/lib/session/session.type';
import { getSessionsDuration, getTaskSessions } from '@/lib/session/session.utils';

export function formatSeconds(seconds: number) {
	if (seconds === 0) {
		return '-';
	}

	const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
	const { hours = 0, minutes = 0, seconds: secs = 0 } = duration;

	if (hours > 0) {
		// Format as HH:MM:SS
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
	}

	// Format as Xm Ys
	const parts = [];
	if (minutes > 0) parts.push(`${minutes}m`);
	if (secs > 0) parts.push(`${secs}s`);
	return parts.join(' ');
}

export function formatSecondsSmall(seconds: number) {
	if (seconds === 0) {
		return '-';
	}

	const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

	const { hours = 0, minutes = 0, seconds: secs = 0 } = duration;

	if (hours > 0) {
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	} else {
		return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	}
}

// get the expected time of a task, but counting only the tasks that have a session already,
// so I can use this to check how these specific tasks were done compared to their expectation
export function getCurrentRoutineExpectedTime(tasks: Task[], sessions: Session[]): number {
	const tasksAccomplished = tasks.filter((task) =>
		sessions.find((session) => session.taskId === task.id),
	);
	return getRoutineExpectedTime(tasksAccomplished);
}

export function getRoutineExpectedTime(tasks: Task[]): number {
	return tasks.reduce((total, task) => total + task.durationInSeconds, 0);
}

export function getDurationFromDate(task: Task, sessions: Session[]) {
	if (sessions.length === 0) return 0;

	const session = getTaskSessions(sessions, task.id);

	return getSessionsDuration(session);
}
