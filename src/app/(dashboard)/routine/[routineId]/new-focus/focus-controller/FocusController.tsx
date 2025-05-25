import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlayIcon,
	RotateCcwIcon,
	SquareIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import { safeThrow } from '@/lib/error-handle';
import { useAtom, useAtomValue } from 'jotai';
import {
	currentSessionAtom,
	currentTaskAtom,
	elapsedTimeAtom,
	taskIndexAtom,
} from '@/app/(dashboard)/routine/[routineId]/new-focus/service';
import { useParams, useRouter } from 'next/navigation';
import { Routes } from '@/lib/consts';
import { useSessionActions } from '@/lib/session/session.hooks';
import { usePrompt } from '@/lib/prompt-context';
import { tasksAtom } from '@/lib/task/task.type';
import { getSessionDuration } from '@/lib/session/session.utils';
import { ContinueIcon } from '@/components/icons/ContinueIcon';

export function FocusController() {
	const task = useAtomValue(currentTaskAtom);
	const tasks = useAtomValue(tasksAtom);
	const [taskIndex, setTaskIndex] = useAtom(taskIndexAtom);
	const [elapsedTime, setElapsedTime] = useAtom(elapsedTimeAtom);
	const currentSession = useAtomValue(currentSessionAtom);

	const router = useRouter();
	const { routineId } = useParams<{ routineId: string }>();
	const { startSession, stopSession, continueSession, resetSession } = useSessionActions(
		routineId,
		task?.id,
	);
	const { createPrompt } = usePrompt();

	const hasStarted = !!currentSession?.startAt;
	const hasEnded = !!currentSession?.endAt;
	const isRunning = hasStarted && !hasEnded;

	useEffect(() => {
		const tick = () => setElapsedTime(getSessionDuration(currentSession));

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
		if (isRunning) return;

		if (taskIndex <= 0) return;

		setTaskIndex((index) => index - 1);
	};

	const handleNextTask = () => {
		if (isRunning) return;

		goToNextTask();
	};

	const goToNextTask = () => {
		if (taskIndex >= tasks.length - 1) {
			router.push(Routes.FINISH(routineId));
			return;
		}

		setTaskIndex((index) => index + 1);
	};

	const handleStart = async () => {
		startSession();
	};

	const handleStop = async () => {
		if (!currentSession) {
			return safeThrow('no session was found');
		}

		stopSession(currentSession);
		goToNextTask();
	};

	const handleContinue = () => {
		if (!currentSession) {
			return safeThrow('no session was found');
		}

		continueSession(currentSession);
	};

	const handleReset = async () => {
		if (!currentSession) {
			return safeThrow('no session was found');
		}

		if (
			!(await createPrompt({
				title: 'Task already accomplished today',
				message: 'Are you sure you wanna to reset it ?',
			}))
		) {
			return;
		}

		resetSession(currentSession);
	};

	return (
		<div className="relative flex h-14 rounded-lg bg-linear-to-r/srgb from-indigo-500 to-teal-400 text-white dark:bg-gray-200">
			{/* Progress Bar */}
			<div
				style={progressBarSize()}
				className="absolute top-0 left-0 h-full w-0 rounded-lg bg-gradient-to-r from-yellow-500 from-10% via-orange-500 via-30% to-red-500 to-90% transition-all duration-100"
			/>

			{/* Controls */}
			<div className="z-10 flex grow">
				<div className="flex flex-1">
					{taskIndex > 0 && (
						<button className="flex grow items-center justify-center" onClick={handlePrevTask}>
							<ChevronLeftIcon className="size-7" />
						</button>
					)}
				</div>

				{!hasStarted && (
					<button onClick={handleStart} className="flex flex-2 items-center justify-center">
						<PlayIcon className="size-7" />
					</button>
				)}

				{isRunning && (
					<button onClick={handleStop} className="flex flex-2 items-center justify-center">
						<SquareIcon className="size-7" />
					</button>
				)}

				{hasEnded && (
					<>
						<button onClick={handleContinue} className="flex flex-1 items-center justify-center">
							<ContinueIcon className="size-7" />
						</button>

						<button onClick={handleReset} className="flex flex-1 items-center justify-center">
							<RotateCcwIcon className="size-6" />
						</button>
					</>
				)}

				<button
					className="flex flex-1 items-center justify-center"
					onClick={handleNextTask}
					disabled={isRunning}
				>
					<ChevronRightIcon className="size-7" />
				</button>
			</div>
		</div>
	);
}
