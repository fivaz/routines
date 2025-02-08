import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { Routine } from '@/lib/routine/routine.type';
import { Task } from '@/lib/task/task.type';
import { Ellipsis } from 'lucide-react';
import { getDuration } from '@/lib/task/task.utils';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { RoutineTasksSummary } from '@/components/routine/routine-tasks-summary';
import { RoutineFocusBottom } from '@/components/routine/routine-focus-bottom';

export default function RoutineFocusMode({
	routine,
	tasks,
	setIsFocusMode,
}: {
	routine: Routine;
	tasks: Task[];
	setIsFocusMode: Dispatch<SetStateAction<boolean>>;
}) {
	const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(0);
	const currentTask = tasks[currentTaskIndex];

	useEffect(() => {
		const today = new Date().toISOString().split('T')[0];
		const todayHistory = currentTask.history?.[today];
		if (todayHistory) {
			setElapsedTime(getDuration(todayHistory.startAt, todayHistory.endAt));
		}
	}, [currentTaskIndex]);

	function handleEndFocus() {
		setIsFocusMode(false);
	}

	return (
		<div className="flex flex-col h-full gap-7">
			<RoutineTasksSummary tasks={tasks} currentTaskIndex={currentTaskIndex} />

			<div className="flex justify-between">
				<div className="text-green-500 text-2xl">{routine.name}</div>

				<Dropdown>
					<DropdownButton outline>
						<Ellipsis />
					</DropdownButton>
					<DropdownMenu>
						<DropdownItem onClick={handleEndFocus}>
							<div className="text-red-500">Leave focus</div>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>

			<div className="flex flex-col justify-between h-full">
				<div className="aspect-[1/1]">
					<img
						src={currentTask.image}
						alt={currentTask.name}
						className="w-full object-cover h-full rounded-lg"
					/>
				</div>

				<RoutineFocusBottom
					tasks={tasks}
					routineId={routine.id}
					currentTaskIndex={currentTaskIndex}
					elapsedTime={elapsedTime}
					setElapsedTime={setElapsedTime}
					setCurrentTaskIndex={setCurrentTaskIndex}
				/>
			</div>
		</div>
	);
}
