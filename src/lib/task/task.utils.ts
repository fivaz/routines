import { formatDuration, intervalToDuration } from 'date-fns';
import { Task } from '@/lib/task/task.type';

export function formatSeconds(seconds: number) {
	const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

	return formatDuration(duration, {
		format: ['hours', 'minutes', 'seconds'], // Only include needed units
		delimiter: ' ', // Separate with space
	}).replace(/hours?|minutes?|seconds?/g, (match) => match[0] + ''); // Convert to "h m s"
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

export function sortTasks(tasks: Task[]) {
	return tasks.toSorted((a, b) => a.order - b.order);
}

export function latestTime(task: Task) {
	const histories = Object.keys(task.history);
	if (!histories.length) {
		return '-';
	}
	const latestKey = histories.sort().pop();
	if (!latestKey) {
		console.error("this shouldn't happen");
		return '-';
	}
	const duration = getDurationFromDate(task, latestKey);
	if (!duration) {
		console.error("this shouldn't happen");
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
