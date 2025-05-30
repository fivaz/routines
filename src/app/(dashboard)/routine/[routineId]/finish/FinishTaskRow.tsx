import { formatSeconds, getDurationFromDate } from '@/lib/task/task.utils';
import { Task } from '@/lib/task/task.type';
import Image from 'next/image';
import { Subheading } from '@/components/base/heading';
import { Text } from '@/components/base/text';
import clsx from 'clsx';
import { useAtomValue } from 'jotai/index';
import { currentSessionsAtom } from '@/app/(dashboard)/routine/[routineId]/focus/service';

export function FinishTaskList({ tasks, today }: { today: string; tasks: Task[] }) {
	return (
		<ul role="list" className="flex flex-wrap justify-between gap-3">
			{tasks.map((task, index) => (
				<div key={task.id} className="w-full md:w-[32%]">
					<FinishTaskRow index={index + 1} task={task} date={today} />
				</div>
			))}
		</ul>
	);
}

function FinishTaskRow({ task, index }: { index: number; task: Task; date: string }) {
	const expectedTime = task.durationInSeconds;
	const { data: sessions } = useAtomValue(currentSessionsAtom);
	const actualTime = getDurationFromDate(task, sessions);
	const deltaTime = expectedTime - actualTime;

	return (
		<li className="flex flex-col gap-2 rounded-md border border-gray-200 p-4 dark:border-gray-700">
			<Subheading>
				{index} - {task.name}
			</Subheading>
			<div className="flex gap-3">
				<Image
					src={task.image}
					alt="task"
					className="h-auto w-1/2 rounded-md"
					width={200}
					height={200}
				/>
				<div className="flex flex-col">
					<Text>complete in:</Text>
					<span className="text-red-500">{formatSeconds(actualTime)}</span>

					<Text>time expected:</Text>
					<Text>{formatSeconds(expectedTime)}</Text>

					<Text>difference:</Text>
					<span
						className={clsx('font-semibold', deltaTime > 0 ? 'text-green-500' : 'text-red-500')}
					>
						{formatSeconds(Math.abs(deltaTime))} {deltaTime > 0 ? 'ahead' : 'late'}
					</span>
				</div>
			</div>
		</li>
	);
}
