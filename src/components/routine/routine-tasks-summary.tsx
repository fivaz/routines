import { PropsWithChildren } from 'react';
import { Task } from '@/lib/task/task.type';

export function RoutineTasksSummary({
	tasks,
	currentTaskIndex,
}: {
	tasks: Task[];
	currentTaskIndex: number;
}) {
	function hasHistory(index: number) {
		const today = new Date().toISOString().split('T')[0];

		return tasks[index].history?.[today];
	}

	return (
		<div className="flex gap-2">
			{tasks.map((_, index) => (
				<div
					key={index}
					className={`min-w-6 h-2 rounded ${index === currentTaskIndex ? 'bg-blue-500' : hasHistory(index) ? 'bg-green-500' : 'bg-gray-300'}`}
				/>
			))}
		</div>
	);
}
