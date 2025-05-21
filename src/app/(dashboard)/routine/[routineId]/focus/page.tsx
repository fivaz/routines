'use client';
import { useEffect, useState } from 'react';
import { Ellipsis } from 'lucide-react';
import { getDuration, getHistory } from '@/lib/task/task.utils';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { RoutineTasksSummary } from '@/app/(dashboard)/routine/[routineId]/focus/routine-tasks-summary';
import { RoutineFocusBottom } from '@/app/(dashboard)/routine/[routineId]/focus/routine-focus-bottom';
import { useTasks } from '@/lib/task/task.context';
import { useRoutine } from '@/lib/routine/routine.hooks';
import { Heading } from '@/components/base/heading';
import { Skeleton } from '@/components/Skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function RoutineFocusPage() {
	const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const { tasks } = useTasks();
	const routine = useRoutine();
	const { routineId } = useParams<{ routineId: string }>();
	const router = useRouter();
	const currentTask = tasks[currentTaskIndex];

	useEffect(() => {
		if (currentTask) {
			const today = new Date().toISOString().split('T')[0];
			const todayHistory = getHistory(currentTask, today);
			if (todayHistory) {
				setElapsedTime(getDuration(todayHistory.startAt, todayHistory.endAt));
			} else {
				setElapsedTime(0);
			}
		}
	}, [currentTask, tasks]);

	function handleEndFocus() {
		router.push(`/routine/${routineId}`);
	}

	if (!currentTask) {
		return null;
	}

	return (
		<div className="flex flex-col justify-between h-full md:h-[calc(100vh-136px)] items-center gap-4">
			<div className="flex flex-col gap-4 w-full">
				<RoutineTasksSummary
					tasks={tasks}
					isRunning={isRunning}
					setCurrentTaskIndex={setCurrentTaskIndex}
					currentTaskIndex={currentTaskIndex}
				/>

				<div className="flex justify-between items-center">
					{routine ? (
						<Heading className="first-letter:capitalize">{routine.name}</Heading>
					) : (
						<Skeleton />
					)}

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
				{currentTask.image ? (
					<img
						src={currentTask.image}
						alt={currentTask.name}
						className="h-full w-full object-cover rounded-lg"
					/>
				) : (
					<div className="text-4xl text-white flex justify-center items-center rounded-lg h-72 w-72 md:h-[550px] md:w-[550px] bg-linear-to-r/shorter from-indigo-500 to-teal-400">
						{currentTaskIndex + 1}
					</div>
				)}
			</div>

			<RoutineFocusBottom
				isRunning={isRunning}
				setIsRunning={setIsRunning}
				currentTaskIndex={currentTaskIndex}
				elapsedTime={elapsedTime}
				setElapsedTime={setElapsedTime}
				setCurrentTaskIndex={setCurrentTaskIndex}
			/>
		</div>
	);
}
