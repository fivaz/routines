'use client';
import { useEffect, useState } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { deleteRoutine, getRoutine } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { emptyRoutine, type Routine } from '@/lib/routine/routine.type';

import { emptyTask, Task } from '@/lib/task/task.type';

import { fetchTasks, updateTasks } from '@/lib/task/task.repository';

import RoutineTaskList from '@/components/routine/routine-task-list';
import RoutineFocusMode from '@/components/routine/routine-focus-mode';

export default function Routine() {
	const [routine, setRoutine] = useState<Routine>(emptyRoutine);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isFocusMode, setIsFocusMode] = useState(false);

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
		<>
			{isFocusMode && tasks.length ? (
				<RoutineFocusMode routine={routine} tasks={tasks} />
			) : (
				<RoutineTaskList
					setIsRunning={setIsFocusMode}
					routine={routine}
					tasks={tasks}
					setTasks={setTasks}
					setRoutine={setRoutine}
				/>
			)}
		</>
	);
}
