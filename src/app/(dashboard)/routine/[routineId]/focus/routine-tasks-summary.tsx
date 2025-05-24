import { Task } from '@/lib/task/task.type';
import { Dispatch, SetStateAction } from 'react';

export function RoutineTasksSummary({
	tasks,
	currentTaskIndex,
	setCurrentTaskIndex,
	isRunning,
}: {
	isRunning: boolean;
	tasks: Task[];
	currentTaskIndex: number;
	setCurrentTaskIndex: Dispatch<SetStateAction<number>>;
}) {
	function hasHistory(index: number) {
		return tasks[index].currentSession;
	}

	function changeTaskIndex(index: number) {
		if (!isRunning) {
			setCurrentTaskIndex(index);
		}
	}

	return (
		<div className="flex w-full md:gap-2 gap-1">
			{tasks.map((_, index) => (
				<button
					onClick={() => changeTaskIndex(index)}
					key={index}
					className={`cursor-pointer grow h-2 rounded ${index === currentTaskIndex ? 'bg-blue-500' : hasHistory(index) ? 'bg-green-500' : 'bg-gray-300'}`}
				/>
			))}
		</div>
	);
}
