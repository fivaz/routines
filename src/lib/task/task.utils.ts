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

export function getDuration(startAt: string, endAt: string): number {
	try {
		const startDate = new Date(startAt);
		const endDate = new Date(endAt);
		return Math.abs((endDate.getTime() - startDate.getTime()) / 1000);
	} catch {
		return 0;
	}
}

export function getHistory(task: Task, date: string) {
	const history = task.history?.[date];
	if (history?.endAt && history?.startAt) {
		return history;
	} else {
		return undefined;
	}
}

export function latestTime(task: Task) {
	const histories = Object.keys(task.history);
	if (!histories.length) {
		return '-';
	}

	const latestKey = histories.sort().pop();
	if (!latestKey) {
		console.error("no key found in history, this shouldn't happen");
		return '-';
	}
	const duration = getDurationFromDate(task, latestKey);
	if (!duration) {
		return '-';
	}
	return formatSeconds(duration);
}

export function getDurationFromDate(task: Task, date: string) {
	const history = getHistory(task, date);
	if (!history) {
		return 0;
	} else {
		return getDuration(history.startAt, history.endAt);
	}
}

export function getTotalExpectedTime(tasks: Task[]): number {
	return tasks.reduce((total, task) => total + task.durationInSeconds, 0);
}

export function getTotalElapsedTime(tasks: Task[], date: string): number {
	return tasks.reduce((total, task) => total + getDurationFromDate(task, date), 0);
}
