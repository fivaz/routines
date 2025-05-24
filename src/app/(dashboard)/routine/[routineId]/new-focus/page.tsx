'use client';
import { Heading } from '@/components/base/heading';
import { Skeleton } from '@/components/Skeleton';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { Ellipsis } from 'lucide-react';
import { useRoutine } from '@/lib/routine/routine.hooks';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/lib/task/task.context';
import { useState } from 'react';

export default function RoutineFocusPage() {
	const routine = useRoutine();
	const { routineId } = useParams<{ routineId: string }>();
	const router = useRouter();
	const { tasks } = useTasks();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const currentTask = tasks[currentIndex];

	// useEffect(() => {
	// 	let interval: NodeJS.Timeout;
	//
	// 	if (currentTask.start && !currentTask?.endTime) {
	// 		const updateElapsed = () => {
	// 			const now = Date.now();
	// 			const start = new Date(currentTask.startTime!).getTime();
	// 			setElapsedSeconds(Math.floor((now - start) / 1000));
	// 		};
	//
	// 		updateElapsed();
	// 		interval = setInterval(updateElapsed, 1000);
	// 	} else {
	// 		setElapsedSeconds(0);
	// 	}
	//
	// 	return () => clearInterval(interval);
	// }, [currentTask.startTime, currentTask?.endTime, currentIndex, tasks]);

	function handleEndFocus() {
		router.push(`/routine/${routineId}`);
	}

	return (
		<div className="flex flex-col justify-between h-full md:h-[calc(100vh-136px)] items-center gap-4">
			<div className="flex flex-col gap-4 w-full">
				<div>RoutineTasksSummary</div>

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
				currenTask
			</div>

			<div>RoutineFocusBottom</div>
		</div>
	);
}
