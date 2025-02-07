'use client';
import { useEffect, useState } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { deleteRoutine, getRoutine, getRoutinePath } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { emptyRoutine, type Routine } from '@/lib/routine/routine.type';
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownMenu,
} from '@/components/base/dropdown';
import { Ellipsis, ZapIcon } from 'lucide-react';
import { Routes } from '@/lib/consts';
import { TaskRow } from '@/components/task/task-row';
import { emptyTask, Task } from '@/lib/task/task.type';
import { Button } from '@/components/base/button';
import { RoutineForm } from '@/components/routine/routine-form';
import { TaskForm } from '@/components/task/task-form';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fetchTasks } from '@/lib/task/task.repository';

export default function Routine() {
	const [routine, setRoutine] = useState<Routine>(emptyRoutine);
	const [tasks, setTasks] = useState<Task[]>([]);

	const [isRoutineFormOpen, setIsRoutineFormOpen] = useState(false);
	const [taskForm, setTaskForm] = useState<Task | null>(null);

	const params = useParams();
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user || !params.routineId) return;
		getRoutine(user.uid, String(params.routineId)).then((routine) => {
			setRoutine(routine);
		});

		const unsubscribe = fetchTasks(user.uid, String(params.routineId), setTasks);

		return () => unsubscribe();
	}, [params.routineId, routine.id, user]);

	function handleDelete() {
		if (!user) return;
		deleteRoutine(user.uid, routine.id);
		router.push(Routes.ROOT);
	}

	function handleAddTask() {
		setTaskForm(emptyTask);
	}

	if (!user) return;

	return (
		<div className="flex flex-col gap-5">
			<div className="flex justify-between">
				<div className="text-green-500 text-2xl">{routine.name}</div>

				<Dropdown>
					<DropdownButton outline>
						<Ellipsis />
					</DropdownButton>
					<DropdownMenu>
						<DropdownItem onClick={handleAddTask}>
							<div className="text-green-500">Add Task</div>
						</DropdownItem>
						<DropdownItem onClick={handleDelete}>Edit</DropdownItem>
						<DropdownItem onClick={handleDelete}>
							<div className="text-red-500">Delete</div>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>

			{tasks.map((task) => (
				<TaskRow key={task.id} userId={user.uid} task={task} routine={routine} />
			))}

			<div className="absolute bottom-4 left-1/2 -translate-x-1/2">
				<Button color="green" onClick={() => console.log('start routine')}>
					<ZapIcon />
					Start Routine
				</Button>
			</div>

			<TaskForm routineId={routine.id} taskIn={taskForm} setTaskIn={setTaskForm} />

			<RoutineForm isOpen={isRoutineFormOpen} setIsOpen={setIsRoutineFormOpen} />
		</div>
	);
}
