import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsRightIcon,
	PlayIcon,
	RotateCcwIcon,
	SquareIcon,
} from 'lucide-react';
import { isNonEmptyArray, safeThrow } from '@/lib/error-handle';
import { useAtom, useAtomValue } from 'jotai';
import {
	currentElapsedTimeAtom,
	currentSessionsAtom,
	currentTaskAtom,
	currentTaskSessionsAtom,
	taskIndexAtom,
} from '@/app/(dashboard)/routine/[routineId]/focus/service';
import { useParams } from 'next/navigation';
import { Routes } from '@/lib/consts';
import { useSessionActions } from '@/lib/session/session.hooks';
import { usePrompt } from '@/lib/prompt-context';
import { tasksAtom } from '@/lib/task/task.type';
import { ContinueIcon } from '@/components/icons/ContinueIcon';

export function FocusController() {
	const task = useAtomValue(currentTaskAtom);
	const tasks = useAtomValue(tasksAtom);
	const [taskIndex, setTaskIndex] = useAtom(taskIndexAtom);
	const elapsedTime = useAtomValue(currentElapsedTimeAtom);
	const currentTaskSessions = useAtomValue(currentTaskSessionsAtom);

	const runningSession = currentTaskSessions.find((session) => session.endAt === '');

	const { routineId } = useParams<{ routineId: string }>();
	const sessions = useAtomValue(currentSessionsAtom);
	const { startSession, endSession, resetSession } = useSessionActions(routineId, task?.id);
	const { createPrompt } = usePrompt();

	const hasNext = taskIndex < tasks.length - 1;

	const progressBarSize = () => {
		if (!task) return { width: `0%` };

		const widthPercentage = Math.min((elapsedTime / task.durationInSeconds) * 100, 100);

		return { width: `${widthPercentage}%` };
	};

	const handlePrevTask = () => {
		setTaskIndex((index) => index - 1);
	};

	const handleNextTask = () => {
		setTaskIndex((index) => index + 1);
	};

	const handleStart = () => {
		startSession();
	};

	const handleStop = async () => {
		if (!runningSession) {
			return safeThrow('no session is running');
		}

		endSession(runningSession);
	};

	const handleContinue = () => {
		startSession();
	};

	const handleReset = async () => {
		if (!isNonEmptyArray(currentTaskSessions)) {
			return safeThrow('No session was found');
		}

		const confirmed = await createPrompt({
			title: 'Do you want to restart this session from now?',
			message:
				'Your previous time will be deleted. If you’d rather continue from where you left off, click the Continue button.',
		});

		if (!confirmed) return;

		resetSession(currentTaskSessions);
	};

	return (
		<div className="relative flex h-14 rounded-lg bg-linear-to-r/srgb from-indigo-500 to-teal-400 text-white dark:bg-gray-200">
			{/* Progress Bar */}
			<div
				style={progressBarSize()}
				className="absolute top-0 left-0 h-full w-0 rounded-lg bg-gradient-to-r from-yellow-500 from-10% via-orange-500 via-30% to-red-500 to-90% transition-all duration-100"
			/>

			{/* Controls */}
			<div className="z-10 flex h-full grow">
				<div className="flex flex-1">
					{taskIndex > 0 && (
						<button
							className="flex grow items-center justify-center"
							onClick={handlePrevTask}
							disabled={!!runningSession}
						>
							<ChevronLeftIcon className="size-7" />
						</button>
					)}
				</div>

				{runningSession ? (
					<button onClick={handleStop} className="flex flex-2 items-center justify-center">
						<SquareIcon className="size-7" />
					</button>
				) : currentTaskSessions.length ? (
					<>
						<button
							onClick={handleContinue}
							disabled={!!runningSession}
							className="flex flex-1 items-center justify-center"
						>
							<ContinueIcon className="size-7" />
						</button>

						<button onClick={handleReset} className="flex flex-1 items-center justify-center">
							<RotateCcwIcon className="size-6" />
						</button>
					</>
				) : (
					<button onClick={handleStart} className="flex flex-2 items-center justify-center">
						<PlayIcon className="size-7" />
					</button>
				)}

				<div className="flex flex-1">
					{hasNext ? (
						<button
							className="flex grow items-center justify-center"
							onClick={handleNextTask}
							disabled={!!runningSession}
						>
							<ChevronRightIcon className="size-7" />
						</button>
					) : (
						sessions.length && (
							<a className="flex grow items-center justify-center" href={Routes.FINISH(routineId)}>
								<ChevronsRightIcon className="size-7" />
							</a>
						)
					)}
				</div>
			</div>
		</div>
	);
}
