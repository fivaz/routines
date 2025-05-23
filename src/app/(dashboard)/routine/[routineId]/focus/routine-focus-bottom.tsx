import { formatSeconds, getTotalElapsedTime, getTotalExpectedTime } from '@/lib/task/task.utils';
import { ChevronLeft, ChevronRight, CircleStop, Play } from 'lucide-react';
import { persistTask } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/user/auth-context';
import { usePrompt } from '@/lib/prompt-context';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/lib/task/task.context';
import RoutineStatus from '@/app/(dashboard)/routine/[routineId]/focus/routine-status';

export function RoutineFocusBottom({
	setCurrentTaskIndex,
	elapsedTime,
	setElapsedTime,
	currentTaskIndex,
	isRunning,
	setIsRunning,
}: {
	isRunning: boolean;
	setIsRunning: Dispatch<SetStateAction<boolean>>;
	setCurrentTaskIndex: Dispatch<SetStateAction<number>>;
	elapsedTime: number;
	currentTaskIndex: number;
	setElapsedTime: Dispatch<SetStateAction<number>>;
}) {
	const { tasks, setTasks } = useTasks();
	const { user } = useAuth();
	const { createPrompt } = usePrompt();
	const today = new Date().toISOString().split('T')[0];
	const { routineId } = useParams<{ routineId: string }>();
	const router = useRouter();
	const currentTask = tasks[currentTaskIndex];

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

		if (isRunning) {
			setElapsedTime(0);

			intervalId = setInterval(() => {
				const now = new Date().toISOString();

				setElapsedTime((prev) => prev + 1);

				setTasks((prevTasks) => {
					const updatedTasks = [...prevTasks];
					const task = updatedTasks[currentTaskIndex];

					if (task?.history?.[today]) {
						task.history[today].endAt = now;
					}

					return updatedTasks;
				});
			}, 1000);
		}

		return () => {
			if (intervalId !== null) {
				clearInterval(intervalId);
			}
		};
	}, [isRunning, setElapsedTime, today, currentTaskIndex, setTasks]);

	const totalElapsedTime = useMemo(
		() => formatSeconds(getTotalElapsedTime(tasks, today)),
		[tasks, today],
	);

	if (!currentTask) {
		return null;
	}

	function totalExpectedTime() {
		return formatSeconds(getTotalExpectedTime(tasks));
	}

	async function handleStart() {
		if (!user) return;

		if (currentTask.history?.[today]) {
			if (
				!(await createPrompt({
					title: 'Task already accomplished today',
					message: 'Are you sure you wanna to override it ?',
				}))
			) {
				return;
			}
		}

		const startTime = new Date().toISOString();
		currentTask.history[today] = { startAt: startTime, endAt: '' };

		setIsRunning(true);
		void persistTask(user.uid, routineId, currentTask);
	}

	function handleStop() {
		if (!user) return;

		const today = new Date().toISOString().split('T')[0];
		currentTask.history[today].endAt = new Date().toISOString();

		setIsRunning(false);
		void persistTask(user.uid, routineId, currentTask);

		if (currentTaskIndex < tasks.length - 1) {
			goToNextTask();
		} else {
			router.push(`/routine/${routineId}`);
		}
	}

	function handlePrevTask() {
		if (isRunning) {
			return;
		}

		if (currentTaskIndex <= 0) {
			return;
		}

		setCurrentTaskIndex(currentTaskIndex - 1);
	}

	function goToNextTask() {
		setCurrentTaskIndex((prev) => (prev < tasks.length - 1 ? prev + 1 : prev));
	}

	const handleNextTask = () => {
		if (isRunning) {
			return;
		}

		if (currentTaskIndex >= tasks.length - 1) {
			router.push(`/routine/${routineId}/finish`);
			return;
		}

		setCurrentTaskIndex(currentTaskIndex + 1);
	};

	function progressBarSize() {
		const widthPercentage = Math.min((elapsedTime / currentTask.durationInSeconds) * 100, 100);

		return { width: `${widthPercentage}%` };
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="gap-2">
				<div className="flex justify-between">
					<h2 className="first-letter:capitalize text-xl font-bold text-green-600 dark:text-green-500">
						{currentTask.name}
					</h2>
					<RoutineStatus today={today} tasks={tasks} />
				</div>

				<div className="flex justify-between items-end">
					<div className="text-lg text-gray-800 dark:text-gray-300">
						{formatSeconds(elapsedTime) || '0s'} / {formatSeconds(currentTask.durationInSeconds)}
					</div>
					<div className="text-red-500 text-lg font-semibold">
						{totalElapsedTime} / {totalExpectedTime()}
					</div>
				</div>
			</div>

			<div className="relative text-white dark:bg-gray-200 bg-linear-to-r/srgb from-indigo-500 to-teal-400 flex h-14 rounded-lg">
				{/* Progress Bar */}
				<div
					style={progressBarSize()}
					className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-yellow-500 from-10% via-orange-500 via-30% to-red-500 to-90% transition-all duration-100 rounded-lg"
				/>

				{/* Controls */}
				<div className="relative bg-transparent z-10 w-1/6 flex">
					{currentTaskIndex > 0 && (
						<button className="size-full flex justify-center items-center" onClick={handlePrevTask}>
							<ChevronLeft className="size-7" />
						</button>
					)}
				</div>

				{isRunning ? (
					<button
						onClick={handleStop}
						className="bg-transparent z-10 p-3 w-4/6 flex justify-center"
					>
						<CircleStop className="size-7" />
					</button>
				) : (
					<button
						onClick={handleStart}
						className="bg-transparent z-10 p-3 w-4/6 flex justify-center"
					>
						<Play className="size-7" />
					</button>
				)}

				<div className="bg-transparent z-10 w-1/6 flex">
					<button
						className="h-full w-full flex justify-center items-center"
						onClick={handleNextTask}
						disabled={isRunning}
					>
						<ChevronRight className="size-7" />
					</button>
				</div>
			</div>
		</div>
	);
}
