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
import { updateTasks } from '@/lib/task/task.repository';
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

export default function RoutineTaskList({
	routine,
	tasks,
	setTasks,
	setIsFocusMode,
}: PropsWithChildren<{
	routine: Routine;
	tasks: Task[];
	setTasks: Dispatch<SetStateAction<Task[]>>;
	setIsFocusMode: Dispatch<SetStateAction<boolean>>;
}>) {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const [taskForm, setTaskForm] = useState<Task | null>(null);

	const { user } = useAuth();
	const router = useRouter();
	const { createPrompt } = usePrompt();

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

	function handleEdit() {
		setRoutineForm(routine);
	}

	function handleAddTask() {
		setTaskForm({ ...emptyTask, order: tasks.length });
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

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!user) return;

		if (over && active.id !== over.id) {
			setTasks((tasks) => reorderTasks(tasks, over.id, active.id));

			void updateTasks(user.uid, routine.id, reorderTasks(tasks, over.id, active.id));
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
				<Button disabled={tasks.length === 0} color="green" onClick={() => setIsFocusMode(true)}>
					<ZapIcon />
					Enter Focus
				</Button>
			</div>

			<TaskForm routineId={routine.id} taskIn={taskForm} setTaskIn={setTaskForm} />

			<RoutineForm routineIn={routineForm} setRoutineIn={setRoutineForm} />
		</div>
	);
}
