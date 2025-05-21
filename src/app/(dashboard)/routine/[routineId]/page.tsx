'use client';
import { useParams, useRouter } from 'next/navigation';
import { type Routine } from '@/lib/routine/routine.type';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { Ellipsis, PlusIcon, ScrollTextIcon, ZapIcon } from 'lucide-react';
import { Routes } from '@/lib/consts';
import { TaskRow } from '@/components/task/task-row';
import { emptyTask, Task } from '@/lib/task/task.type';
import { Button } from '@/components/base/button';
import { RoutineForm } from '@/components/routine/routine-form';
import { TaskForm } from '@/components/task/task-form';
import { usePrompt } from '@/lib/prompt-context';
import { ListIcon } from '@/components/icons/ListIcon';
import { useTasks } from '@/lib/task/task.context';
import { useRoutine, useRoutineActions } from '@/lib/routine/routine.hooks';
import { Heading, Subheading } from '@/components/base/heading';
import { DragDropProvider } from '@dnd-kit/react';
import { formatSeconds } from '@/lib/task/task.utils';
import { useBackendStatus } from '@/lib/use-backend-status';
import { useState } from 'react';
import { Skeleton } from '@/components/Skeleton';

export default function RoutinePage() {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const [taskForm, setTaskForm] = useState<Task | null>(null);

	const { handleSort, tasks } = useTasks();
	const routine = useRoutine();
	const { status } = useBackendStatus();
	const { routineId } = useParams<{ routineId: string }>();
	const { createPrompt } = usePrompt();
	const { deleteRoutine } = useRoutineActions();
	const router = useRouter();

	function handleGoToRecap() {
		router.push(`/routine/${routineId}/recap`);
	}

	function handleEdit() {
		if (!routine) return;
		setRoutineForm(routine);
	}

	function handleAddTask() {
		setTaskForm({ ...emptyTask, order: tasks.length });
	}

	async function handleDelete() {
		if (!routine) return;
		if (
			await createPrompt({
				title: 'Delete Routine',
				message: 'Are you sure you want to delete this routine?',
			})
		) {
			void deleteRoutine(routine.id);
			router.push(Routes.ROOT);
		}
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					{routine ? <Heading>{routine.name}</Heading> : <Skeleton />}
					{routine ? (
						<Subheading>({formatSeconds(routine.totalDuration)})</Subheading>
					) : (
						<Skeleton className="w-10" />
					)}
				</div>

				<div className="flex gap-3">
					<div className="hidden md:flex gap-3">
						<Button
							outline
							onClick={handleAddTask}
							isLoading={status === 'loading'}
							disabled={status === 'loading'}
						>
							<PlusIcon className="size-5" />
						</Button>
						<Button outline onClick={handleGoToRecap}>
							<ScrollTextIcon className="size-5" />
						</Button>
					</div>
					<Dropdown>
						<DropdownButton outline>
							<Ellipsis className="size-5" />
						</DropdownButton>
						<DropdownMenu>
							<DropdownItem
								className="block md:hidden"
								onClick={handleAddTask}
								disabled={status === 'loading'}
							>
								Add task
							</DropdownItem>
							<DropdownItem className="block md:hidden" onClick={handleGoToRecap}>
								Go to recap
							</DropdownItem>
							<DropdownItem onClick={handleEdit}>Edit</DropdownItem>
							<DropdownItem onClick={handleDelete}>
								<div className="text-red-500">Delete</div>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			{routine && tasks.length > 0 ? (
				<DragDropProvider onDragEnd={handleSort}>
					{tasks.map((task, index) => (
						<TaskRow index={index} key={task.id} task={task} routine={routine} />
					))}
				</DragDropProvider>
			) : (
				<div className="md:pt-28 pt-32 flex justify-center items-center flex-col">
					<ListIcon className="size-12 text-gray-400" />
					<h2 className="mt-2 text-base font-semibold dark:text-white text-gray-900">Add tasks</h2>
					<p className="mt-1 text-sm text-gray-500">
						You haven’t added any task to your routine yet.
					</p>
					<Button onClick={handleAddTask} color="green" className="mt-2">
						<PlusIcon className="size-5" />
						Add Task
					</Button>
				</div>
			)}

			<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
				<Button disabled={tasks.length === 0} color="green" href={`/routine/${routineId}/focus`}>
					<ZapIcon />
					Enter Focus
				</Button>
			</div>

			{routine && <TaskForm routineId={routine.id} taskIn={taskForm} setTaskIn={setTaskForm} />}

			<RoutineForm routineIn={routineForm} setRoutineIn={setRoutineForm} />
		</div>
	);
}
