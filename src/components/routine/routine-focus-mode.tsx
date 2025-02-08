import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { Routine } from '@/lib/routine/routine.type';
import { Task } from '@/lib/task/task.type';
import { Ellipsis } from 'lucide-react';
import { getDuration, getHistory } from '@/lib/task/task.utils';
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

	useEffect(() => {
		const today = new Date().toISOString().split('T')[0];
		const todayHistory = getHistory(tasks[currentTaskIndex], today);
		if (todayHistory) {
			setElapsedTime(getDuration(todayHistory.startAt, todayHistory.endAt));
		} else {
			setElapsedTime(0);
		}
	}, [currentTaskIndex, tasks]);

	function handleEndFocus() {
		setIsFocusMode(false);
	}

	return (
		<div className="flex flex-col justify-between overflow-hidden h-full md:h-[calc(100vh-136px)] items-center gap-4">
			<div className="flex flex-col gap-4 w-full">
				<RoutineTasksSummary tasks={tasks} currentTaskIndex={currentTaskIndex} />

				<div className="flex justify-between items-center">
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
			</div>

			<div className="flex overflow-hidden aspect-square items-center justify-center">
				{tasks[currentTaskIndex].image ? (
					<img
						src={tasks[currentTaskIndex].image}
						alt={tasks[currentTaskIndex].name}
						className="h-full w-full object-cover rounded-lg"
					/>
				) : (
					<div className="text-4xl text-white flex justify-center items-center rounded-lg h-72 w-72 md:h-[550px] md:w-[550px] bg-linear-to-r/shorter from-indigo-500 to-teal-400">
						{currentTaskIndex + 1}
					</div>
				)}
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
	);
}
