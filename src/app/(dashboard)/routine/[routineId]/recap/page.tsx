'use client';
import { useState } from 'react';
import { Task } from '@/lib/task/task.type';
import { Heading } from '@/components/base/heading';
import { Text } from '@/components/base/text';
import { formatSeconds, formatSecondsSmall, getDuration, getHistory } from '@/lib/task/task.utils';
import { TaskHistoryCarousel } from '@/app/(dashboard)/routine/[routineId]/recap/task-history-carousel';
import { ChevronDownIcon, ChevronUpIcon, UndoIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import { useTasks } from '@/lib/task/task.context';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function RoutineRecapPage() {
	const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
	const { tasks } = useTasks();
	const { routineId } = useParams<{ routineId: string }>();

	function getDurationFromDate(task: Task, date: string) {
		const history = getHistory(task, date);
		if (!history) {
			return 0;
		}
		if (!history.startAt || !history.endAt) {
			return 0;
		}
		return getDuration(history.startAt, history.endAt);
	}

	function getExpectedTime() {
		const totalDuration = tasks.reduce((sum, task) => sum + task.durationInSeconds, 0);

		return formatSeconds(totalDuration);
	}

	function getActualTime() {
		const totalDuration = tasks.reduce((sum, task) => sum + getDurationFromDate(task, date), 0);

		return formatSeconds(totalDuration);
	}

	function DeltaIcon({ task }: { task: Task }) {
		const expectedTime = task.durationInSeconds;
		const actualTime = getDurationFromDate(task, date);

		if (actualTime === 0) {
			return <div className="size-5"></div>;
		}

		if (expectedTime < actualTime) {
			return <ChevronUpIcon className="text-red-500 size-5" />;
		}

		if (expectedTime > actualTime) {
			return <ChevronDownIcon className="text-green-500 size-5" />;
		}

		return <div className="size-5"></div>;
	}

	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center">
				<Heading className="pb-4">Recap</Heading>
				<Button outline href={`/routine/${routineId}`}>
					<UndoIcon className="size-5" />
				</Button>
			</div>
			<TaskHistoryCarousel date={date} setDate={setDate} />

			<div>
				<li className="py-4 flex justify-between">
					<Text className="w-2/4 truncate">Total: </Text>
					<Text className="w-1/4 text-right">{getExpectedTime()}</Text>
					<Text className="w-1/4 text-right">{getActualTime()}</Text>
				</li>
				<ul role="list" className=" divide-y divide-gray-200">
					{tasks.map((task) => (
						<li key={task.id} className="py-2 gap-2 flex justify-between items-center">
							<div className="flex gap-2 items-center w-1/2 truncate">
								{task.image && (
									<Image
										src={task.image}
										alt="task"
										className="md:size-10 size-8 rounded-md"
										width={40}
										height={40}
									/>
								)}
								<Text className={clsx({ 'w-1/2': !!task.image }, 'truncate')}>{task.name}</Text>
							</div>
							<div className="flex gap-2 items-center">
								<Text className="hidden md:block w-30 text-right">
									{formatSeconds(task.durationInSeconds)}
								</Text>
								<Text className="block md:hidden w-17 text-right">
									{formatSecondsSmall(task.durationInSeconds)}
								</Text>

								<Text className="hidden md:block w-30 text-right">
									{formatSeconds(getDurationFromDate(task, date))}
								</Text>
								<Text className="block md:hidden w-17 text-right">
									{formatSecondsSmall(getDurationFromDate(task, date))}
								</Text>

								<DeltaIcon task={task} />
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
