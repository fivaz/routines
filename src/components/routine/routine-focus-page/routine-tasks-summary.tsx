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
		<div className="flex w-full md:gap-2 gap-1">
			{tasks.map((_, index) => (
				<div
					key={index}
					className={`grow h-2 rounded ${index === currentTaskIndex ? 'bg-blue-500' : hasHistory(index) ? 'bg-green-500' : 'bg-gray-300'}`}
				/>
			))}
		</div>
	);
}
