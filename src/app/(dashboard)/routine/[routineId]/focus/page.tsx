'use client';
import { useEffect, useState } from 'react';
import { Ellipsis } from 'lucide-react';
import { getDuration } from '@/lib/task/task.utils';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { RoutineTasksSummary } from '@/app/(dashboard)/routine/[routineId]/focus/routine-tasks-summary';
import { RoutineFocusBottom } from '@/app/(dashboard)/routine/[routineId]/focus/routine-focus-bottom';
import { useTasks } from '@/lib/task/task.context';
import { useRoutine } from '@/lib/routine/routine.hooks';
import { Heading } from '@/components/base/heading';
import { Skeleton } from '@/components/Skeleton';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

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
			if (currentTask.currentSession) {
				setElapsedTime(
					getDuration(currentTask.currentSession.startAt, currentTask.currentSession.endAt),
				);
			} else {
				setElapsedTime(0);
			}
		}
	}, [currentTask, tasks]);

	function handleEndFocus() {
		router.push(`/routine/${routineId}`);
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
				{!currentTask ? (
					<div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded-sm sm:w-96 dark:bg-gray-700">
						<svg
							className="w-10 h-10 text-gray-200 dark:text-gray-600"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 18"
						>
							<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
						</svg>
					</div>
				) : currentTask.image ? (
					<Image
						src={currentTask.image}
						alt={currentTask.name}
						width={1024}
						height={1024}
						priority={true}
						sizes="(max-width: 768px) 400px, 1024px"
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
