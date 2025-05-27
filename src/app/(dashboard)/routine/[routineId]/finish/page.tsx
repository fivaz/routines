'use client';
import { Heading } from '@/components/base/heading';
import { formatSeconds, getRoutineExpectedTime } from '@/lib/task/task.utils';
import clsx from 'clsx';
import { FinishTaskList } from '@/app/(dashboard)/routine/[routineId]/finish/FinishTaskRow';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/base/button';
import { UndoIcon } from 'lucide-react';
import { getToday } from '@/lib/session/session.utils';
import { useAtomValue } from 'jotai';
import { tasksAtom } from '@/lib/task/task.type';
import {
	currentSessionsAtom,
	loadingCurrentSessionsAtom,
	routineDeltaAtom,
	totalElapsedTimeAtom,
} from '@/app/(dashboard)/routine/[routineId]/focus/service';
import { LoadingText } from '@/components/LoadingText';
import { FinishTaskListSkeleton } from '@/app/(dashboard)/routine/[routineId]/finish/FinishTaskListSkeleton';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { EmptyFinishPage } from './EmptyFinishPage';

export default function FinishPage() {
	const today = getToday();
	const routineId = useAtomValue(routineIdAtom);
	const tasks = useAtomValue(tasksAtom);
	const sessions = useAtomValue(currentSessionsAtom);
	const loading = useAtomValue(loadingCurrentSessionsAtom);
	// const loading = true;
	const totalElapsedTime = useAtomValue(totalElapsedTimeAtom);
	const routineDelta = useAtomValue(routineDeltaAtom);
	const expectedTime = getRoutineExpectedTime(tasks);

	useEffect(() => {
		if (!sessions.length) return;

		const duration = 10 * 1000;
		const interval = 500;
		const end = Date.now() + duration;

		const intervalId = setInterval(() => {
			if (loading) {
				return;
			}

			if (Date.now() > end) {
				clearInterval(intervalId);
				return;
			}

			// Confetti from left
			confetti({
				particleCount: 7,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
			});

			// Confetti from right
			confetti({
				particleCount: 7,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
			});
		}, interval);

		return () => clearInterval(intervalId);
	}, [loading, sessions.length]);

	if (!loading && sessions.length === 0) {
		return <EmptyFinishPage />;
	}

	return (
		<div className="relative flex flex-col gap-3">
			<div className="absolute top-0 right-0">
				<Button outline href={`/routine/${routineId}`}>
					<UndoIcon className="size-5" />
				</Button>
			</div>

			<div className="flex justify-center pb-7">
				<div className="flex flex-col items-center gap-2">
					<Heading className="pb-5">Congratulations!</Heading>

					<span className="text-lg font-semibold text-black dark:text-white">Your time:</span>
					<LoadingText loading={loading}>
						<span className="text-3xl font-semibold text-red-500">
							{formatSeconds(totalElapsedTime)}
						</span>
					</LoadingText>

					<span className="text-lg font-semibold text-black dark:text-white">Time expected:</span>
					<LoadingText loading={loading}>
						<span className="text-lg font-semibold text-black dark:text-white">
							{formatSeconds(expectedTime)}
						</span>
					</LoadingText>

					<span className="text-lg font-semibold text-black dark:text-white">Difference:</span>
					<LoadingText loading={loading}>
						<span
							className={clsx(
								'text-lg font-semibold',
								routineDelta > 0 ? 'text-green-500' : 'text-red-500',
							)}
						>
							{formatSeconds(Math.abs(routineDelta))} {routineDelta > 0 ? 'ahead' : 'late'}
						</span>
					</LoadingText>
				</div>
			</div>

			{loading ? <FinishTaskListSkeleton /> : <FinishTaskList today={today} tasks={tasks} />}
		</div>
	);
}
