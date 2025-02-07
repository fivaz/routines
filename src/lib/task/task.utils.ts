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
	const startDate = new Date(startAt);
	const endDate = new Date(endAt);
	return Math.abs((endDate.getTime() - startDate.getTime()) / 1000);
}

export function sortTasks(tasks: Task[]) {
	return tasks.toSorted((a, b) => a.order - b.order);
}
