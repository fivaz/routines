import { Task } from '@/lib/task/task.type';
import { Skeleton } from '@/components/Skeleton';
import RoutineStatus from '../../focus/routine-status';
import { formatSeconds, getTotalExpectedTime } from '@/lib/task/task.utils';
import { useTasks } from '@/lib/task/task.context';
import { useEffect, useMemo } from 'react';
import { useSessions } from '@/lib/session/session.context';
import {
	getCurrentTotalElapsedTime,
	getSessionDuration,
} from '@/app/(dashboard)/routine/[routineId]/new-focus/focus-footer/service';
import { useAtom } from 'jotai/index';
import { elapsedTimeAtom } from '@/app/(dashboard)/routine/[routineId]/new-focus/service';

export function FocusFooter({ task }: { task?: Task }) {
	const { tasks } = useTasks();
	const { sessions } = useSessions();
	const [elapsedTime, setElapsedTime] = useAtom(elapsedTimeAtom);

	const currentSession = useMemo(
		() => sessions.find((session) => session.taskId == task?.id),
		[task, sessions],
	);

	useEffect(() => {
		setElapsedTime(getSessionDuration(currentSession));
	}, [currentSession, setElapsedTime]);

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
					<RoutineStatus />
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
