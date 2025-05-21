import { Task } from '@/lib/task/task.type';
import { formatSeconds } from '@/lib/task/task.utils';
import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

export default function RoutineStatus({ tasks, today }: { tasks: Task[]; today: string }) {
	function getRoutineDelta(tasks: Task[], today: string): number {
		let totalDelta = 0;

		for (const task of tasks) {
			const history = task.history?.[today];
			if (!history || !history.startAt || !history.endAt) continue;

			const start = new Date(history.startAt).getTime();
			const end = new Date(history.endAt).getTime();

			const actualDuration = (end - start) / 1000; // in seconds
			const expectedDuration = task.durationInSeconds;

			const delta = actualDuration - expectedDuration;
			totalDelta += delta;
		}

		return totalDelta;
	}

	const deltaInSeconds = getRoutineDelta(tasks, today);

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
		<div className={clsx('flex gap-2 items-center', isLate ? 'text-red-500' : 'text-green-500')}>
			<span className="text-sm">{formatSeconds(Math.abs(deltaInSeconds))}</span>
			<StatusIcon />
		</div>
	);
}
