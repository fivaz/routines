import { formatSeconds, getDurationFromDate } from '@/lib/task/task.utils';
import { Task } from '@/lib/task/task.type';
import Image from 'next/image';
import { Subheading } from '@/components/base/heading';
import { Text } from '@/components/base/text';
import clsx from 'clsx';

export function FinishTaskRow({ task, date, index }: { index: number; task: Task; date: string }) {
	const expectedTime = task.durationInSeconds;
	const actualTime = getDurationFromDate(task, date);
	const deltaTime = expectedTime - actualTime;

	return (
		<li className="gap-2 flex flex-col p-4 border border-gray-200 dark:border-gray-700 rounded-md">
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
					<Text>time expected:</Text>
					<Text>{formatSeconds(expectedTime)}</Text>

					<Text>complete in:</Text>
					<Text>{formatSeconds(actualTime)}</Text>

					<Text>difference:</Text>
					<span className={clsx(deltaTime > 0 ? 'text-green-500' : 'text-red-500')}>
						{formatSeconds(Math.abs(deltaTime))} {deltaTime > 0 ? 'ahead' : 'late'}
					</span>
				</div>
			</div>
		</li>
	);
}
