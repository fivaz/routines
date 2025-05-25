import { formatDuration, intervalToDuration } from 'date-fns';
import { Task } from '@/lib/task/task.type';

export function formatSeconds(seconds: number) {
	if (seconds === 0) {
		return '-';
	}

	const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

	return formatDuration(duration, {
		format: ['hours', 'minutes', 'seconds'], // Only include needed units
		delimiter: ' ', // Separate with space
	}).replace(/hours?|minutes?|seconds?/g, (match) => match[0] + ''); // Convert to "h m s"
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
