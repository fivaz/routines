import { Dispatch, SetStateAction, useState } from 'react';
import { Task } from '@/lib/task/task.type';
import { Heading } from '@/components/base/heading';
import { Text } from '@/components/base/text';
import { formatSeconds, getDuration, getDurationFromDate, getHistory } from '@/lib/task/task.utils';
import { TaskHistoryCarousel } from '@/components/routine/routine-recap-page/task-history-carousel';
import { UndoIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import { useTasks } from '@/lib/task/task.context';

export function RoutineRecapPage({
	setPage,
}: {
	setPage: Dispatch<SetStateAction<'focus' | 'recap' | 'list'>>;
}) {
	const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
	const { tasks } = useTasks();

	function getTimeFromDate(task: Task) {
		const history = getHistory(task, date);
		if (!history) {
			return '-';
		}
		return formatSeconds(getDuration(history.startAt, history.endAt));
	}

	function getExpectedTime() {
		const totalDuration = tasks.reduce((sum, task) => sum + task.durationInSeconds, 0);

		return formatSeconds(totalDuration);
	}

	function getActualTime() {
		const totalDuration = tasks.reduce((sum, task) => sum + getDurationFromDate(task, date), 0);

		return formatSeconds(totalDuration);
	}

	return (
		<div className="flex flex-col">
			<div className="flex justify-between">
				<Heading className="pb-4">Recap</Heading>
				<Button plain onClick={() => setPage('list')}>
					<UndoIcon />
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
						<li key={task.id} className="py-4 flex justify-between">
							<Text className="w-2/4 truncate">{task.name}</Text>
							<Text className="w-1/4 text-right">{formatSeconds(task.durationInSeconds)}</Text>
							<Text className="w-1/4 text-right">{getTimeFromDate(task)}</Text>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
