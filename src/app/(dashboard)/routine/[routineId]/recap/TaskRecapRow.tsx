import Image from 'next/image';
import { Text } from '@/components/base/text';
import clsx from 'clsx';
import { formatSeconds, formatSecondsSmall, getDurationFromDate } from '@/lib/task/task.utils';
import { Task } from '@/lib/task/task.type';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useAtomValue } from 'jotai/index';
import { currentSessionsAtom } from '@/app/(dashboard)/routine/[routineId]/focus/service';

export function TaskRecapRow({ task }: { task: Task }) {
	const { data: sessions } = useAtomValue(currentSessionsAtom);
	return (
		<li className="flex justify-between py-2">
			<div className="flex w-2/4 items-center gap-2 truncate">
				{task.image && (
					<Image
						src={task.image}
						alt="task"
						className="size-8 rounded-md md:size-10"
						width={40}
						height={40}
					/>
				)}
				<Text className={clsx({ 'w-1/2': !!task.image }, 'truncate')}>{task.name}</Text>
			</div>

			<div className="flex w-1/4 items-center justify-end">
				<Text className="hidden w-30 text-right md:block">
					{formatSeconds(task.durationInSeconds)}
				</Text>
				<Text className="block w-17 text-right md:hidden">
					{formatSecondsSmall(task.durationInSeconds)}
				</Text>
			</div>

			<div className="flex w-1/4 items-center justify-end gap-2">
				<Text className="hidden w-30 text-right md:block">
					{formatSeconds(getDurationFromDate(task, sessions))}
				</Text>
				<Text className="block w-17 text-right md:hidden">
					{formatSecondsSmall(getDurationFromDate(task, sessions))}
				</Text>
				<DeltaIcon task={task} />
			</div>
		</li>
	);
}

function DeltaIcon({ task }: { task: Task }) {
	const { data: sessions } = useAtomValue(currentSessionsAtom);
	const expectedTime = task.durationInSeconds;
	const actualTime = getDurationFromDate(task, sessions);

	if (actualTime === 0) {
		return <div className="size-5 shrink-0"></div>;
	}

	if (expectedTime < actualTime) {
		return <ChevronUpIcon className="size-5 shrink-0 text-red-500" />;
	}

	if (expectedTime > actualTime) {
		return <ChevronDownIcon className="size-5 shrink-0 text-green-500" />;
	}

	return <div className="size-5 shrink-0"></div>;
}
