import { Skeleton } from '@/components/Skeleton';
import { formatSeconds, getRoutineExpectedTime } from '@/lib/task/task.utils';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import {
	currentElapsedTimeAtom,
	currentTaskAtom,
	totalElapsedTimeAtom,
} from '@/app/(dashboard)/routine/[routineId]/focus/service';
import { tasksAtom } from '@/lib/task/task.type';
import RoutineStatus from '@/app/(dashboard)/routine/[routineId]/focus/task-info/RoutineStatus';

export function TaskInfo() {
	const task = useAtomValue(currentTaskAtom);
	const elapsedTime = useAtomValue(currentElapsedTimeAtom);
	const tasks = useAtomValue(tasksAtom);
	const totalElapsedTime = useAtomValue(totalElapsedTimeAtom);

	const totalExpectedTime = useMemo(() => formatSeconds(getRoutineExpectedTime(tasks)), [tasks]);

	if (!task) {
		return (
			<div className="flex w-full flex-col gap-4">
				<div className="gap-2">
					<div className="flex justify-between">
						<Skeleton />
						<Skeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="gap-2">
				<div className="flex justify-between">
					<h2 className="text-xl font-bold text-green-600 first-letter:capitalize dark:text-green-500">
						{task.name}
					</h2>
					<RoutineStatus />
				</div>

				<div className="flex items-end justify-between">
					<div className="text-lg text-gray-800 dark:text-gray-300">
						<span className="truncate">{formatSeconds(elapsedTime) || '0s'}</span> /{' '}
						<span>{formatSeconds(task.durationInSeconds)}</span>
					</div>
					<div className="text-lg font-semibold text-red-500">
						<span className="truncate">{formatSeconds(totalElapsedTime)}</span> /{' '}
						<span>{totalExpectedTime}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
