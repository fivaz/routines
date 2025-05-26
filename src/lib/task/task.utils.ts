import { intervalToDuration } from 'date-fns';
import { Task } from '@/lib/task/task.type';
import { Session } from '@/lib/session/session.type';
import { getSessionDuration, getTaskSessions } from '@/lib/session/session.utils';

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

export function getCurrentRoutineExpectedTime(tasks: Task[], sessions: Session[]): number {
	return sessions.reduce((sum, session) => {
		const task = tasks.find((t) => t.id === session.taskId);
		if (!task) return sum;
		return sum + task.durationInSeconds;
	}, 0);
}

export function getRoutineExpectedTime(tasks: Task[]): number {
	return tasks.reduce((total, task) => total + task.durationInSeconds, 0);
}

export function getDurationFromDate(task: Task, sessions: Session[]) {
	if (sessions.length === 0) return 0;

	const session = getTaskSessions(sessions, task.id);

	return getSessionDuration(session);
}
