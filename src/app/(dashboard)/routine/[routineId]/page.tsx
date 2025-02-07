'use client';
import { useEffect, useState } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
	deleteRoutine,
	getRoutine,
	getRoutinePath,
	updateRoutines,
} from '@/lib/routine/routine.repository';
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
import { fetchTasks, updateTasks } from '@/lib/task/task.repository';
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
import RoutineTaskList from '@/components/routine/routine-task-list';

export default function Routine() {
	const [routine, setRoutine] = useState<Routine>(emptyRoutine);
	const [tasks, setTasks] = useState<Task[]>([]);

	const params = useParams();
	const { user } = useAuth();

	useEffect(() => {
		if (!user || !params.routineId) return;
		getRoutine(user.uid, String(params.routineId)).then((routine) => {
			setRoutine(routine);
		});

		const unsubscribe = fetchTasks(user.uid, String(params.routineId), (tasks) =>
			setTasks(sortTasks(tasks)),
		);

		return () => unsubscribe();
	}, [params.routineId, routine.id, user]);

	function sortTasks(tasks: Task[]) {
		return tasks.toSorted((a, b) => a.order - b.order);
	}

	if (!user) return;

	return (
		<RoutineTaskList routine={routine} tasks={tasks} setTasks={setTasks} setRoutine={setRoutine} />
	);
}
