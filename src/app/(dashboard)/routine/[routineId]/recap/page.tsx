'use client';
import { useState } from 'react';
import { Task, tasksAtom } from '@/lib/task/task.type';
import { Heading } from '@/components/base/heading';
import { Text } from '@/components/base/text';
import { formatSeconds, formatSecondsSmall, getDurationFromDate } from '@/lib/task/task.utils';
import { TaskHistoryCarousel } from '@/app/(dashboard)/routine/[routineId]/recap/task-history-carousel';
import { ChevronDownIcon, ChevronUpIcon, UndoIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { sessionsAtom } from '@/app/(dashboard)/routine/[routineId]/focus/service';

export default function RoutineRecapPage() {
	const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
	const tasks = useAtomValue(tasksAtom);
	const sessions = useAtomValue(sessionsAtom);
	const { routineId } = useParams<{ routineId: string }>();

	function getExpectedTime() {
		const totalDuration = tasks.reduce((sum, task) => sum + task.durationInSeconds, 0);

		return formatSeconds(totalDuration);
	}

	function getActualTime() {
		const totalDuration = tasks.reduce((sum, task) => sum + getDurationFromDate(task, sessions), 0);

		return formatSeconds(totalDuration);
	}

	function DeltaIcon({ task }: { task: Task }) {
		const expectedTime = task.durationInSeconds;
		const actualTime = getDurationFromDate(task, sessions);

		if (actualTime === 0) {
			return <div className="size-5"></div>;
		}

		if (expectedTime < actualTime) {
			return <ChevronUpIcon className="size-5 text-red-500" />;
		}

		if (expectedTime > actualTime) {
			return <ChevronDownIcon className="size-5 text-green-500" />;
		}

		return <div className="size-5"></div>;
	}

	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between">
				<Heading className="pb-4">Recap</Heading>
				<Button outline href={`/routine/${routineId}`}>
					<UndoIcon className="size-5" />
				</Button>
			</div>
			<TaskHistoryCarousel date={date} setDate={setDate} />

			<div>
				<li className="flex justify-between py-4">
					<Text className="w-2/4 truncate">Total: </Text>
					<Text className="w-1/4 text-right">{getExpectedTime()}</Text>
					<Text className="w-1/4 text-right">{getActualTime()}</Text>
				</li>
				<ul role="list" className="divide-y divide-gray-200">
					{tasks.map((task) => (
						<li key={task.id} className="flex items-center justify-between gap-2 py-2">
							<div className="flex w-1/2 items-center gap-2 truncate">
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
							<div className="flex items-center gap-2">
								<Text className="hidden w-30 text-right md:block">
									{formatSeconds(task.durationInSeconds)}
								</Text>
								<Text className="block w-17 text-right md:hidden">
									{formatSecondsSmall(task.durationInSeconds)}
								</Text>

								<Text className="hidden w-30 text-right md:block">
									{formatSeconds(getDurationFromDate(task, sessions))}
								</Text>
								<Text className="block w-17 text-right md:hidden">
									{formatSecondsSmall(getDurationFromDate(task, sessions))}
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
