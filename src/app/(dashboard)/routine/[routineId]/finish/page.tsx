'use client';
import { Heading } from '@/components/base/heading';
import { formatSeconds, getHistory, getTotalElapsedTime } from '@/lib/task/task.utils';
import { useTasks } from '@/lib/task/task.context';

export default function FinishPage() {
	const { tasks } = useTasks();
	const today = new Date().toISOString().split('T')[0];

	const hasNoHistory = tasks.every((task) => !getHistory(task, today));

	if (hasNoHistory) {
		return <div>no history</div>;
	}

	return (
		<div className="flex justify-center">
			<Heading>Your time:</Heading>
			<Heading>{formatSeconds(getTotalElapsedTime(tasks, today))}</Heading>
		</div>
	);
}
