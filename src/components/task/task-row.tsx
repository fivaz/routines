import { PropsWithChildren, useState } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { Button } from '../base/button';
import { Routes } from '@/lib/consts';
import Link from 'next/link';
import { emptyTask, Task } from '@/lib/task/task.type';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { Ellipsis } from 'lucide-react';
import { deleteTask } from '@/lib/task/task.repository';
import { intervalToDuration, formatDuration } from 'date-fns';
import { TaskForm } from '@/components/task/task-form';

export function TaskRow({
	userId,
	task,
	routine,
}: PropsWithChildren<{ userId: string; task: Task; routine: Routine }>) {
	const [taskForm, setTaskForm] = useState<Task | null>(null);

	function handleEdit() {
		setTaskForm(task);
	}

	function handleDelete() {
		deleteTask(userId, routine.id, task.id);
	}

	function formatSeconds(seconds: number) {
		const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

		return formatDuration(duration, {
			format: ['hours', 'minutes', 'seconds'], // Only include needed units
			delimiter: ' ', // Separate with space
		}).replace(/hour|minute|second/g, (match) => match[0] + ''); // Convert to "h m s"
	}

	return (
		<>
			<div
				className="relative bg-gray-800 text-white p-4 h-40 bg-cover bg-center"
				style={{ backgroundImage: `url('${task.image}')` }}
			>
				<div className="flex justify-between items-center">
					<span className="bg-green-500 bg-opacity-50 p-0.5 text-lg">{task.name}</span>
					<div className="flex gap-3 items-center">
						<span className="bg-green-500 bg-opacity-50 p-0.5 text-lg">
							{formatSeconds(task.durationInSeconds)}
						</span>
						<Dropdown>
							<DropdownButton outline>
								<Ellipsis />
							</DropdownButton>
							<DropdownMenu>
								<DropdownItem onClick={handleEdit}>Edit</DropdownItem>
								<DropdownItem onClick={handleDelete}>
									<div className="text-red-500">Delete</div>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>

			<TaskForm routineId={routine.id} taskIn={taskForm} setTaskIn={setTaskForm} />
		</>
	);
}
