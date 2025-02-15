import { Dispatch, SetStateAction, useState } from 'react';
import { Task } from '@/lib/task/task.type';
import { Heading } from '@/components/base/heading';
import { Text } from '@/components/base/text';
import { formatSeconds, getDuration, getHistory } from '@/lib/task/task.utils';
import { TaskHistoryCarousel } from '@/components/routine/routine-recap-page/task-history-carousel';
import { ChevronDownIcon, ChevronUpIcon, UndoIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import { useTasks } from '@/lib/task/task.context';
import Image from 'next/image';

export function RoutineRecapPage({
	setPage,
}: {
	setPage: Dispatch<SetStateAction<'focus' | 'recap' | 'list'>>;
}) {
	const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
	const { tasks } = useTasks();

	function getTimeFromDate(task: Task) {
		const duration = getDurationFromDate(task, date);
		if (!duration) {
			return '-';
		}
		return formatSeconds(duration);
	}

	function getDurationFromDate(task: Task, date: string) {
		const history = getHistory(task, date);
		if (!history) {
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
				<Button outline onClick={() => setPage('list')}>
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
				<ul role="list" className=" divide-y divide-gray-200 ">
					{tasks.map((task) => (
						<li key={task.id} className="py-2 flex justify-between items-center">
							<div className="w-2/4 flex gap-2 items-center">
								<Image src={task.image} alt="task" className="rounded-md" width={40} height={40} />
								<Text className="truncate">{task.name}</Text>
							</div>
							<Text className="w-1/4 text-right">{formatSeconds(task.durationInSeconds)}</Text>
							<div className="w-1/4 flex gap-2 items-center justify-end">
								<Text>{getTimeFromDate(task)}</Text>
								<DeltaIcon task={task} />
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
