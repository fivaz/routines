import { tasksAtom } from '@/lib/task/task.type';
import { formatSeconds } from '@/lib/task/task.utils';
import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { sessionsAtom } from '@/app/(dashboard)/routine/[routineId]/new-focus/service';
import { useMemo } from 'react';
import { getRoutineDelta } from '@/app/(dashboard)/routine/[routineId]/new-focus/focus-footer/service';

export default function RoutineStatus() {
	const tasks = useAtomValue(tasksAtom);
	const sessions = useAtomValue(sessionsAtom);

	const deltaInSeconds = useMemo(() => getRoutineDelta(tasks, sessions), [tasks, sessions]);

	const isLate = deltaInSeconds > 0;
	const isSlight = Math.abs(deltaInSeconds) < 60;

	const StatusIcon = () => {
		if (deltaInSeconds === 0) return null;

		if (isLate) {
			return isSlight ? <ChevronDown className="size-4" /> : <ChevronsDown className="size-4" />;
		} else {
			return isSlight ? <ChevronUp className="size-4" /> : <ChevronsUp className="size-4" />;
		}
	};

	return (
		<div className={clsx('flex items-center gap-2', isLate ? 'text-red-500' : 'text-green-500')}>
			<span className="text-sm">{formatSeconds(Math.abs(deltaInSeconds))}</span>
			<StatusIcon />
		</div>
	);
}
