import { intervalToDuration } from 'date-fns';
import { Task } from '@/lib/task/task.type';

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

export function getTotalExpectedTime(tasks: Task[]): number {
	return tasks.reduce((total, task) => total + task.durationInSeconds, 0);
}

export function getCurrentTotalElapsedTime(tasks: Task[]): number {
	return tasks.reduce((total, task) => total + getCurrentSessionDuration(task), 0);
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
