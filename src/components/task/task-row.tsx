import { PropsWithChildren, useState } from 'react';
import { type Task } from '@/lib/task/task.type';
import { Button } from '../base/button';
import { Routes } from '@/lib/consts';
import Link from 'next/link';
import { type Routine } from '@/lib/routine/routine.type';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { Ellipsis, GripVertical } from 'lucide-react';
import { deleteTask } from '@/lib/task/task.repository';
import { intervalToDuration, formatDuration } from 'date-fns';
import { TaskForm } from '@/components/task/task-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatSeconds } from '@/lib/task/task.utils';

export function TaskRow({
	userId,
	task,
	routine,
}: PropsWithChildren<{ userId: string; task: Task; routine: Routine }>) {
	const [taskForm, setTaskForm] = useState<Task | null>(null);

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: task.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	function handleEdit() {
		setTaskForm(task);
	}

	function handleDelete() {
		deleteTask(userId, routine.id, task.id);
	}

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			className="relative bg-gray-800 text-white p-4 h-40 bg-cover bg-center flex flex-col justify-between"
			style={{ backgroundImage: `url('${task.image}')`, ...style }}
		>
			<div className="flex justify-between items-center">
				<GripVertical className="bg-green-500" {...listeners}></GripVertical>
				<div className="flex gap-3 items-center">
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
			<div className="flex justify-between items-center">
				<span className="bg-green-500 bg-opacity-50 p-0.5 text-lg">{task.name}</span>
				<span className="bg-green-500 bg-opacity-50 p-0.5 text-lg">
					{formatSeconds(task.durationInSeconds)}
				</span>
			</div>

			<TaskForm routineId={routine.id} taskIn={taskForm} setTaskIn={setTaskForm} />
		</div>
	);
}
