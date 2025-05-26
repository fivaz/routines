import { MouseEvent, PropsWithChildren, useState } from 'react';
import { type Task } from '@/lib/task/task.type';
import { type Routine } from '@/lib/routine/routine.type';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { Ellipsis, GripVerticalIcon } from 'lucide-react';
import { useTaskActions } from '@/lib/task/task.hooks';
import { TaskForm } from '@/components/task/task-form';
import { useSortable } from '@dnd-kit/react/sortable';
import { formatSeconds } from '@/lib/task/task.utils';
import { usePrompt } from '@/lib/prompt-context';
import { Button } from '@/components/base/button';
import { ImageWaitingSkeleton } from '@/components/task/ImageWaitingSkeleton';

export function TaskRow({
	task,
	routine,
	index,
}: PropsWithChildren<{ index: number; task: Task; routine: Routine }>) {
	const [taskForm, setTaskForm] = useState<Task | null>(null);
	const { createPrompt } = usePrompt();

	const { deleteTask } = useTaskActions(routine.id);

	const { ref } = useSortable({ id: task.id, index });

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
			await deleteTask(routine.id, task.id);
		}
	}

	return (
		<div
			ref={ref}
			className="group relative flex h-40 flex-col justify-between rounded-lg border-green-400 bg-cover bg-center p-4 text-white hover:border"
			style={{ backgroundImage: `url('${task.image}')` }}
		>
			<ImageWaitingSkeleton image={task.image} />
			<div className="absolute top-4 left-4 z-20">
				<Button
					outline
					className="dark cursor-grab touch-none"
					onClick={(e: MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation(); // Prevent link click when button is clicked
					}}
				>
					<GripVerticalIcon className="size-6" />
				</Button>
			</div>

			<div className="absolute top-4 right-4 z-20">
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

			<div
				onClick={handleEdit}
				className="z-10 flex h-full w-full cursor-pointer items-end justify-between"
			>
				<span className="p-0.5 group-hover:underline first-letter:uppercase">{task.name}</span>

				<span className="p-0.5 group-hover:underline">{formatSeconds(task.durationInSeconds)}</span>
			</div>

			<div className="absolute inset-0 rounded-lg bg-black/25"></div>

			<TaskForm routineId={routine.id} taskIn={taskForm} setTaskIn={setTaskForm} />
		</div>
	);
}
