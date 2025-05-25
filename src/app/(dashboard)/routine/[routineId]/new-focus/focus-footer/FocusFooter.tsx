import { Skeleton } from '@/components/Skeleton';
import { formatSeconds, getTotalExpectedTime } from '@/lib/task/task.utils';
import { useMemo } from 'react';
import { getCurrentTotalElapsedTime } from '@/app/(dashboard)/routine/[routineId]/new-focus/focus-footer/service';
import { useAtomValue } from 'jotai';
import {
	currentTaskAtom,
	elapsedTimeAtom,
	sessionsAtom,
} from '@/app/(dashboard)/routine/[routineId]/new-focus/service';
import { tasksAtom } from '@/lib/task/task.type';

export function FocusFooter() {
	const task = useAtomValue(currentTaskAtom);
	const elapsedTime = useAtomValue(elapsedTimeAtom);
	const sessions = useAtomValue(sessionsAtom);
	const tasks = useAtomValue(tasksAtom);

	const totalElapsedTime = useMemo(
		() => formatSeconds(getCurrentTotalElapsedTime(sessions)),
		[sessions],
	);

	const totalExpectedTime = useMemo(() => formatSeconds(getTotalExpectedTime(tasks)), [tasks]);

	if (!task) {
		return (
			<div className="flex flex-col gap-4 w-full">
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
		<div className="flex flex-col gap-4 w-full">
			<div className="gap-2">
				<div className="flex justify-between">
					<h2 className="first-letter:capitalize text-xl font-bold text-green-600 dark:text-green-500">
						{task.name}
					</h2>
					{/*<RoutineStatus />*/}
				</div>

				<div className="flex justify-between items-end">
					<div className="text-lg text-gray-800 dark:text-gray-300">
						{formatSeconds(elapsedTime) || '0s'} / {formatSeconds(task.durationInSeconds)}
					</div>
					<div className="text-red-500 text-lg font-semibold">
						{totalElapsedTime} / {totalExpectedTime}
					</div>
				</div>
			</div>
		</div>
	);
}
