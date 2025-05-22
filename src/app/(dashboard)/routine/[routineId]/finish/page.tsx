'use client';
import { Heading } from '@/components/base/heading';
import {
	formatSeconds,
	getHistory,
	getTotalElapsedTime,
	getTotalExpectedTime,
} from '@/lib/task/task.utils';
import { useTasks } from '@/lib/task/task.context';
import clsx from 'clsx';
import { FinishTaskRow } from '@/app/(dashboard)/routine/[routineId]/finish/FinishTaskRow';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function FinishPage() {
	const { tasks } = useTasks();
	const today = new Date().toISOString().split('T')[0];

	const hasNoHistory = tasks.every((task) => !getHistory(task, today));

	useEffect(() => {
		if (!hasNoHistory) return;

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
	}, [hasNoHistory]);

	if (hasNoHistory) {
		return <div>no history</div>;
	}

	const totalExpectedTime = getTotalExpectedTime(tasks);
	const totalElapsedTime = getTotalElapsedTime(tasks, today);
	const deltaTime = totalExpectedTime - totalElapsedTime;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex justify-center pb-7">
				<div className="flex flex-col items-center gap-2">
					<Heading className="pb-5">Congratulations!</Heading>

					<span className="font-semibold text-lg text-black dark:text-white">Your time:</span>
					<span className="font-semibold text-3xl text-red-500">
						{formatSeconds(getTotalElapsedTime(tasks, today))}
					</span>

					<span className="font-semibold text-lg text-black dark:text-white">Time expected:</span>
					<span className="font-semibold text-lg text-black dark:text-white">
						{formatSeconds(getTotalExpectedTime(tasks))}
					</span>

					<span className="font-semibold text-lg text-black dark:text-white">Difference:</span>
					<span
						className={clsx(
							'font-semibold text-lg',
							deltaTime > 0 ? 'text-green-500' : 'text-red-500',
						)}
					>
						{formatSeconds(Math.abs(deltaTime))} {deltaTime > 0 ? 'ahead' : 'late'}
					</span>
				</div>
			</div>

			<ul role="list" className="gap-3 flex flex-wrap justify-between">
				{tasks.map((task, index) => (
					<div key={task.id} className="w-full md:w-[32%]">
						<FinishTaskRow index={index + 1} task={task} date={today} />
					</div>
				))}
			</ul>
		</div>
	);
}
