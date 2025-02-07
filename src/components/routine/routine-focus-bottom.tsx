import { formatSeconds } from '@/lib/task/task.utils';
import { ChevronLeft, ChevronRight, CircleStop, Play } from 'lucide-react';
import { persistTask } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/auth-context';
import { usePrompt } from '@/lib/prompt-context';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Task } from '@/lib/task/task.type';

export function RoutineFocusBottom({
	setCurrentTaskIndex,
	elapsedTime,
	setElapsedTime,
	tasks,
	currentTaskIndex,
	routineId,
}: {
	setCurrentTaskIndex: Dispatch<SetStateAction<number>>;
	elapsedTime: number;
	currentTaskIndex: number;
	tasks: Task[];
	setElapsedTime: Dispatch<SetStateAction<number>>;
	routineId: string;
}) {
	const [isRunning, setIsRunning] = useState(false);
	const currentTask = tasks[currentTaskIndex];

	const { user } = useAuth();
	const { createPrompt } = usePrompt();

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;
		if (isRunning) {
			setElapsedTime(0);
			timer = setInterval(() => {
				setElapsedTime((prev) => prev + 1);
			}, 1000);
		}

		return () => {
			if (timer !== null) {
				clearInterval(timer);
			}
		};
	}, [isRunning]);

	async function handleStart() {
		if (!user) return;

		const today = new Date().toISOString().split('T')[0];

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
		goToNextTask();
	}

	function handlePrevTask() {
		if (!isRunning && currentTaskIndex > 0) {
			setCurrentTaskIndex(currentTaskIndex - 1);
		}
	}

	function goToNextTask() {
		setCurrentTaskIndex((prev) => (prev < tasks.length - 1 ? prev + 1 : prev));
	}

	const handleNextTask = () => {
		if (!isRunning && currentTaskIndex < tasks.length - 1) {
			setCurrentTaskIndex(currentTaskIndex + 1);
		}
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="mb-2">
				<h2 className="text-xl font-bold text-green-600 dark:text-green-500">{currentTask.name}</h2>
				<p className="text-lg text-gray-800 dark:text-gray-300">
					{formatSeconds(elapsedTime) || '0s'} / {formatSeconds(currentTask.durationInSeconds)}
				</p>
			</div>

			<div className="relative dark:text-green-600 dark:bg-gray-200 bg-gray-300 text-white flex overflow-hidden h-14 -mx-6">
				{/* Progress Bar */}
				<div
					style={{ width: `${(elapsedTime / currentTask.durationInSeconds) * 100}%` }}
					className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% transition-all duration-100"
				/>

				{/* Controls */}
				<div className="relative bg-transparent z-10 w-1/6 flex">
					{currentTaskIndex > 0 && (
						<button
							className="h-full w-full flex justify-center items-center"
							onClick={handlePrevTask}
						>
							<ChevronLeft className="w-7 h-7" />
						</button>
					)}
				</div>

				{isRunning ? (
					<button
						onClick={handleStop}
						className="relative bg-transparent z-10 p-3 w-4/6 flex justify-center"
					>
						<CircleStop className="w-7 h-7" />
					</button>
				) : (
					<button
						onClick={handleStart}
						className="relative bg-transparent z-10 p-3 w-4/6 flex justify-center"
					>
						<Play className="w-7 h-7" />
					</button>
				)}

				<div className="relative bg-transparent z-10 w-1/6 flex">
					<button
						className="h-full w-full flex justify-center items-center"
						onClick={handleNextTask}
						disabled={isRunning}
					>
						<ChevronRight className="w-7 h-7" />
					</button>
				</div>
			</div>
		</div>
	);
}
