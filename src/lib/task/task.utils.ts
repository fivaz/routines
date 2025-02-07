import { formatDuration, intervalToDuration } from 'date-fns';

export function formatSeconds(seconds: number) {
	const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

	return formatDuration(duration, {
		format: ['hours', 'minutes', 'seconds'], // Only include needed units
		delimiter: ' ', // Separate with space
	}).replace(/hours?|minutes?|seconds?/g, (match) => match[0] + ''); // Convert to "h m s"
}
