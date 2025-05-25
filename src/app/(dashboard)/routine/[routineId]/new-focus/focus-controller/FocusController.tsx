import { ChevronLeft, ChevronRight, CircleStop, Play } from 'lucide-react';
import { useEffect } from 'react';
import { safeThrow } from '@/lib/error-handle';
import { useAtom, useAtomValue } from 'jotai';
import {
	currentSessionAtom,
	currentTaskAtom,
	elapsedTimeAtom,
	sessionsAtom,
	taskIndexAtom,
} from '@/app/(dashboard)/routine/[routineId]/new-focus/service';
import { useParams, useRouter } from 'next/navigation';
import { Routes } from '@/lib/consts';
import { useSessionActions } from '@/lib/session/session.hooks';
import { usePrompt } from '@/lib/prompt-context';
import { tasksAtom } from '@/lib/task/task.type';
import { getSessionDuration } from '@/lib/session/session.utils';

export function FocusController() {
	const task = useAtomValue(currentTaskAtom);
	const tasks = useAtomValue(tasksAtom);
	const [taskIndex, setTaskIndex] = useAtom(taskIndexAtom);
	const [elapsedTime, setElapsedTime] = useAtom(elapsedTimeAtom);
	const sessions = useAtomValue(sessionsAtom);
	const currentSession = useAtomValue(currentSessionAtom);

	const router = useRouter();
	const { routineId } = useParams<{ routineId: string }>();
	const { startSession, stopSession } = useSessionActions(routineId, task?.id);
	const { createPrompt } = usePrompt();

	const isRunning = !!currentSession?.startAt && !currentSession?.endAt;

	useEffect(() => {
		const tick = () => {
			// console.log('sessions', sessions);
			const x = getSessionDuration(currentSession);
			setElapsedTime(x);
		};

		tick(); // run immediately
		const interval = setInterval(tick, 1000);

		return () => clearInterval(interval);
	}, [currentSession, setElapsedTime]);

	const progressBarSize = () => {
		if (!task) return { width: `0%` };

		const widthPercentage = Math.min((elapsedTime / task.durationInSeconds) * 100, 100);

		return { width: `${widthPercentage}%` };
	};

	const handlePrevTask = () => {
		if (isRunning) {
			return;
		}

		if (taskIndex <= 0) {
			return;
		}

		setTaskIndex((index) => index - 1);
	};

	const handleNextTask = () => {
		if (isRunning) {
			return;
		}

		if (taskIndex >= tasks.length - 1) {
			router.push(Routes.FINISH(routineId));
			return;
		}

		setTaskIndex((index) => index + 1);
	};

	const handleStart = async () => {
		console.log('1');
		if (currentSession?.startAt) {
			console.log('2');
			if (
				!(await createPrompt({
					title: 'Task already accomplished today',
					message: 'Are you sure you wanna to override it ?',
				}))
			) {
				console.log('3');
				return;
			}
		}
		console.log('4');
		void startSession();
	};

	function handleStop() {
		if (!currentSession) {
			return safeThrow('no session was found');
		}

		void stopSession(currentSession);
		handleNextTask();
	}

	return (
		<div className="relative text-white dark:bg-gray-200 bg-linear-to-r/srgb from-indigo-500 to-teal-400 flex h-14 rounded-lg">
			{/* Progress Bar */}
			<div
				style={progressBarSize()}
				className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-yellow-500 from-10% via-orange-500 via-30% to-red-500 to-90% transition-all duration-100 rounded-lg"
			/>

			{/* Controls */}
			<div className="relative bg-transparent z-10 w-1/6 flex">
				{taskIndex > 0 && (
					<button className="size-full flex justify-center items-center" onClick={handlePrevTask}>
						<ChevronLeft className="size-7" />
					</button>
				)}
			</div>

			{isRunning ? (
				<button onClick={handleStop} className="bg-transparent z-10 p-3 w-4/6 flex justify-center">
					<CircleStop className="size-7" />
				</button>
			) : (
				<button onClick={handleStart} className="bg-transparent z-10 p-3 w-4/6 flex justify-center">
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
	);
}
