import { PropsWithChildren, useState } from 'react';
import { type Task } from '@/lib/task/task.type';
import { type Routine } from '@/lib/routine/routine.type';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { Ellipsis, GripVertical } from 'lucide-react';
import { deleteTask } from '@/lib/task/task.repository';
import { TaskForm } from '@/components/task/task-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatSeconds, latestTime } from '@/lib/task/task.utils';
import { usePrompt } from '@/lib/prompt-context';

export function TaskRow({
	userId,
	task,
	routine,
}: PropsWithChildren<{ userId: string; task: Task; routine: Routine }>) {
	const [taskForm, setTaskForm] = useState<Task | null>(null);
	const { createPrompt } = usePrompt();

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

	async function handleDelete() {
		if (
			await createPrompt({
				title: 'Delete Task',
				message: 'Are you sure you want to delete this task?',
			})
		) {
			deleteTask(userId, routine.id, task.id);
		}
	}

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			className="relative rounded-lg bg-gray-800 text-white p-4 h-40 bg-cover bg-center flex flex-col justify-between"
			style={{ backgroundImage: `url('${task.image}')`, ...style }}
		>
			<div className="z-10 flex justify-between items-center">
				<GripVertical className="" {...listeners}></GripVertical>
				<div className="flex gap-3 items-center">
					<Dropdown>
						<DropdownButton outline className="dark">
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

			<div className="z-10 flex justify-between items-center">
				<span className="p-0.5 text-lg">{task.name}</span>
				<span className="p-0.5 text-lg">
					{`${latestTime(task)}` || '-'} / {formatSeconds(task.durationInSeconds)}
				</span>
			</div>

			<div className="absolute inset-0 bg-black/25 rounded-lg"></div>

			<TaskForm routineId={routine.id} taskIn={taskForm} setTaskIn={setTaskForm} />
		</div>
	);
}
