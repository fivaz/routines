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

export default function FinishPage() {
	const { tasks } = useTasks();
	const today = new Date().toISOString().split('T')[0];

	const hasNoHistory = tasks.every((task) => !getHistory(task, today));

	if (hasNoHistory) {
		return <div>no history</div>;
	}

	const totalExpectedTime = getTotalExpectedTime(tasks);
	const totalElapsedTime = getTotalElapsedTime(tasks, today);
	const deltaTime = totalExpectedTime - totalElapsedTime;

	return (
		<div className="flex flex-col gap-3 divide-y divide-gray-200">
			<div className="flex justify-center pb-3">
				<div className="flex flex-col gap-2 items-center">
					<Heading>Your time:</Heading>
					<span className="font-semibold text-2xl text-red-500">
						{formatSeconds(getTotalElapsedTime(tasks, today))}
					</span>
					<Heading>Time expected:</Heading>
					<Heading>{formatSeconds(getTotalExpectedTime(tasks))}</Heading>
					<Heading>Difference:</Heading>
					<span
						className={clsx(
							'font-semibold text-2xl',
							deltaTime > 0 ? 'text-green-500' : 'text-red-500',
						)}
					>
						{formatSeconds(Math.abs(deltaTime))} {deltaTime > 0 ? 'ahead' : 'late'}
					</span>
				</div>
			</div>

			<ul role="list" className=" divide-y divide-gray-200">
				{tasks.map((task) => (
					<FinishTaskRow task={task} key={task.id} date={today} />
				))}
			</ul>
		</div>
	);
}
