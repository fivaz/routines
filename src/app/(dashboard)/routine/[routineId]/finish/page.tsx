'use client';
import { Heading } from '@/components/base/heading';
import { formatSeconds, getRoutineExpectedTime } from '@/lib/task/task.utils';
import clsx from 'clsx';
import { FinishTaskRow } from '@/app/(dashboard)/routine/[routineId]/finish/FinishTaskRow';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/base/button';
import { UndoIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { getToday } from '@/lib/session/session.utils';
import { useAtomValue } from 'jotai';
import { tasksAtom } from '@/lib/task/task.type';
import {
	routineDeltaAtom,
	sessionsAtom,
	totalElapsedTimeAtom,
} from '@/app/(dashboard)/routine/[routineId]/focus/service';

export default function FinishPage() {
	const today = getToday();
	const { routineId } = useParams<{ routineId: string }>();
	const tasks = useAtomValue(tasksAtom);
	const sessions = useAtomValue(sessionsAtom);
	const totalElapsedTime = useAtomValue(totalElapsedTimeAtom);
	const routineDelta = useAtomValue(routineDeltaAtom);
	const expectedTime = getRoutineExpectedTime(tasks);

	useEffect(() => {
		if (!sessions.length) return;

		const duration = 10 * 1000;
		const interval = 500;
		const end = Date.now() + duration;

		const intervalId = setInterval(() => {
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
	}, [sessions.length]);

	if (sessions.length === 0) {
		return <div>no history</div>;
	}

	return (
		<div className="relative flex flex-col gap-3">
			<div className="absolute top-0 right-0">
				<Button outline href={`/routine/${routineId}`}>
					<UndoIcon className="size-5" />
				</Button>
			</div>

			<>
				<div className="flex justify-center pb-7">
					<div className="flex flex-col items-center gap-2">
						<Heading className="pb-5">Congratulations!</Heading>

						<span className="text-lg font-semibold text-black dark:text-white">Your time:</span>
						<span className="text-3xl font-semibold text-red-500">
							{formatSeconds(totalElapsedTime)}
						</span>

						<span className="text-lg font-semibold text-black dark:text-white">Time expected:</span>
						<span className="text-lg font-semibold text-black dark:text-white">
							{formatSeconds(expectedTime)}
						</span>

						<span className="text-lg font-semibold text-black dark:text-white">Difference:</span>
						<span
							className={clsx(
								'text-lg font-semibold',
								routineDelta > 0 ? 'text-green-500' : 'text-red-500',
							)}
						>
							{formatSeconds(Math.abs(routineDelta))} {routineDelta > 0 ? 'ahead' : 'late'}
						</span>
					</div>
				</div>

				<ul role="list" className="flex flex-wrap justify-between gap-3">
					{tasks.map((task, index) => (
						<div key={task.id} className="w-full md:w-[32%]">
							<FinishTaskRow index={index + 1} task={task} date={today} />
						</div>
					))}
				</ul>
			</>
		</div>
	);
}
