'use client';
import { tasksAtom } from '@/lib/task/task.type';
import { Heading } from '@/components/base/heading';
import { Text } from '@/components/base/text';
import { formatSeconds, getRoutineExpectedTime } from '@/lib/task/task.utils';
import { TaskHistoryCarousel } from '@/app/(dashboard)/routine/[routineId]/recap/task-history-carousel';
import { UndoIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import { useParams } from 'next/navigation';
import { useAtom, useAtomValue } from 'jotai';
import { totalElapsedTimeAtom } from '@/app/(dashboard)/routine/[routineId]/focus/service';
import { dateAtom } from '@/lib/session/session.type';
import { Routes } from '@/lib/const';
import { TaskRecapRow } from '@/app/(dashboard)/routine/[routineId]/recap/TaskRecapRow';
import { useMemo } from 'react';
import { RoutineTimeByDate } from '@/app/(dashboard)/routine/[routineId]/recap/RoutineTimeByDate';
import { sessionsAtom, sessionsAtomEffect } from './service';

export default function RoutineRecapPage() {
	const [date, setDate] = useAtom(dateAtom);
	const tasks = useAtomValue(tasksAtom);
	const totalElapsedTime = useAtomValue(totalElapsedTimeAtom);
	const { routineId } = useParams<{ routineId: string }>();
	useAtom(sessionsAtomEffect);
	const sessions = useAtomValue(sessionsAtom);

	const getExpectedTime = useMemo(() => formatSeconds(getRoutineExpectedTime(tasks)), [tasks]);

	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between">
				<Heading className="pb-4">Recap</Heading>
				<Button outline href={Routes.ROUTINE(routineId)}>
					<UndoIcon className="size-5" />
				</Button>
			</div>

			<TaskHistoryCarousel date={date} setDate={setDate} />

			<div>
				<div className="flex justify-between py-4">
					<Text className="w-2/4 truncate">Total</Text>
					<Text className="w-1/4 text-right">{getExpectedTime}</Text>
					<Text className="w-1/4 pr-7 text-right">{formatSeconds(totalElapsedTime)}</Text>
				</div>

				<RoutineTimeByDate sessions={sessions} />

				<ul role="list" className="divide-y divide-gray-200">
					{tasks.map((task) => (
						<TaskRecapRow task={task} key={task.id} />
					))}
				</ul>
			</div>
		</div>
	);
}
