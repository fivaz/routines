import { formatSeconds } from '@/lib/task/task.utils';
import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { routineDeltaAtom } from '@/app/(dashboard)/routine/[routineId]/new-focus/service';

export default function RoutineStatus() {
	const routineTimeDelta = useAtomValue(routineDeltaAtom);

	const isLate = routineTimeDelta > 0;
	const isSlight = Math.abs(routineTimeDelta) < 60;

	const StatusIcon = () => {
		if (routineTimeDelta === 0) return null;

		if (isLate) {
			return isSlight ? <ChevronDown className="size-4" /> : <ChevronsDown className="size-4" />;
		} else {
			return isSlight ? <ChevronUp className="size-4" /> : <ChevronsUp className="size-4" />;
		}
	};

	return (
		<div className={clsx('flex items-center gap-2', isLate ? 'text-red-500' : 'text-green-500')}>
			<span className="text-sm">{formatSeconds(Math.abs(routineTimeDelta))}</span>
			<StatusIcon />
		</div>
	);
}
