import { formatSeconds, getDurationFromDate } from '@/lib/task/task.utils';
import { ChevronLeft, ChevronRight, CircleStop, Play } from 'lucide-react';
import { persistTask } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/user/auth-context';
import { usePrompt } from '@/lib/prompt-context';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/lib/task/task.context';

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
	const { tasks } = useTasks();
	const { user } = useAuth();
	const { createPrompt } = usePrompt();
	const today = new Date().toISOString().split('T')[0];
	const { routineId } = useParams<{ routineId: string }>();
	const router = useRouter();

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
	}, [isRunning, setElapsedTime]);

	const totalElapsedTime = useMemo(
		() => formatSeconds(tasks.reduce((total, task) => total + getDurationFromDate(task, today), 0)),
		[tasks, today],
	);

	function totalExpectedTime() {
		return formatSeconds(tasks.reduce((total, task) => total + task.durationInSeconds, 0));
	}

	async function handleStart() {
		if (!user) return;

		if (tasks[currentTaskIndex].history?.[today]) {
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
		tasks[currentTaskIndex].history[today] = { startAt: startTime, endAt: '' };

		setIsRunning(true);
		void persistTask(user.uid, routineId, tasks[currentTaskIndex]);
	}

	function handleStop() {
		if (!user) return;

		const today = new Date().toISOString().split('T')[0];
		tasks[currentTaskIndex].history[today].endAt = new Date().toISOString();

		setIsRunning(false);
		void persistTask(user.uid, routineId, tasks[currentTaskIndex]);
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
		const widthPercentage = Math.min(
			(elapsedTime / tasks[currentTaskIndex].durationInSeconds) * 100,
			100,
		);

		return { width: `${widthPercentage}%` };
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="gap-2">
				<h2 className="first-letter:capitalize text-xl font-bold text-green-600 dark:text-green-500">
					{tasks[currentTaskIndex].name}
				</h2>

				<div className="flex justify-between items-end">
					<div className="text-lg text-gray-800 dark:text-gray-300">
						{formatSeconds(elapsedTime) || '0s'} /{' '}
						{formatSeconds(tasks[currentTaskIndex].durationInSeconds)}
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
						className="bg-transparent z-10 p-3 w-4/6 flex justify-center"
					>
						<CircleStop className="w-7 h-7" />
					</button>
				) : (
					<button
						onClick={handleStart}
						className="bg-transparent z-10 p-3 w-4/6 flex justify-center"
					>
						<Play className="w-7 h-7" />
					</button>
				)}

				<div className="bg-transparent z-10 w-1/6 flex">
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
