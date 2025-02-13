import { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';

import { useRouter } from 'next/navigation';
import { deleteRoutine } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { type Routine } from '@/lib/routine/routine.type';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/base/dropdown';
import { Ellipsis, PlusIcon, ZapIcon } from 'lucide-react';
import { Routes } from '@/lib/consts';
import { TaskRow } from '@/components/task/task-row';
import { emptyTask, Task } from '@/lib/task/task.type';
import { Button } from '@/components/base/button';
import { RoutineForm } from '@/components/routine/routine-form';
import { TaskForm } from '@/components/task/task-form';
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { usePrompt } from '@/lib/prompt-context';
import { ListIcon } from '@/components/icons/ListIcon';
import { useTasks } from '@/lib/task/task.context';

export default function RoutineTaskListPage({
	routine,
	setPage,
}: PropsWithChildren<{
	routine: Routine;
	setTasks: Dispatch<SetStateAction<Task[]>>;
	setPage: Dispatch<SetStateAction<'focus' | 'recap' | 'list'>>;
}>) {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const [taskForm, setTaskForm] = useState<Task | null>(null);
	const { handleReorder, tasks } = useTasks();

	const { user } = useAuth();
	const router = useRouter();
	const { createPrompt } = usePrompt();

	function handleGoToRecap() {
		setPage('recap');
	}

	function handleEdit() {
		setRoutineForm(routine);
	}

	function handleAddTask() {
		setTaskForm({ ...emptyTask, order: tasks.length });
	}

	async function handleDelete() {
		if (!user) return;
		if (
			await createPrompt({
				title: 'Delete Routine',
				message: 'Are you sure you want to delete this routine?',
			})
		) {
			deleteRoutine(user.uid, routine.id);
			router.push(Routes.ROOT);
		}
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function reorderTasks(tasks: Task[], overId: UniqueIdentifier, activeId: UniqueIdentifier) {
		const oldIndex = tasks.findIndex((task) => task.id === String(activeId));
		const newIndex = tasks.findIndex((task) => task.id === String(overId));

		return arrayMove(tasks, oldIndex, newIndex);
	}

	function handleDragEnd({ active, over }: DragEndEvent) {
		if (over && active.id !== over.id) {
			const oldIndex = tasks.findIndex((r) => r.id === active.id);
			const newIndex = tasks.findIndex((r) => r.id === over.id);
			handleReorder(oldIndex, newIndex);
		}
	}
	if (!user) return;

	return (
		<div className="flex flex-col gap-5">
			<div className="flex justify-between">
				<div className="text-green-500 text-2xl">{routine.name}</div>

				<div className="flex gap-3">
					<Button outline onClick={handleAddTask}>
						<PlusIcon className="size-5" />
						Add Task
					</Button>
					<Dropdown>
						<DropdownButton outline>
							<Ellipsis />
						</DropdownButton>
						<DropdownMenu>
							<DropdownItem onClick={handleGoToRecap}>Go to recap</DropdownItem>
							<DropdownItem onClick={handleEdit}>Edit</DropdownItem>
							<DropdownItem onClick={handleDelete}>
								<div className="text-red-500">Delete</div>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			{tasks.length === 0 && (
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

			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={tasks} strategy={verticalListSortingStrategy}>
					{tasks.map((task) => (
						<TaskRow key={task.id} userId={user.uid} task={task} routine={routine} />
					))}
				</SortableContext>
			</DndContext>

			<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
				<Button disabled={tasks.length === 0} color="green" onClick={() => setPage('focus')}>
					<ZapIcon />
					Enter Focus
				</Button>
			</div>

			<TaskForm routineId={routine.id} taskIn={taskForm} setTaskIn={setTaskForm} />

			<RoutineForm routineIn={routineForm} setRoutineIn={setRoutineForm} />
		</div>
	);
}
