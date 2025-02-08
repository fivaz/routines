'use client';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import { fetchRoutine } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { emptyRoutine, type Routine } from '@/lib/routine/routine.type';

import { Task } from '@/lib/task/task.type';

import { fetchTasks } from '@/lib/task/task.repository';

import RoutineTaskList from '@/components/routine/routine-task-list';
import RoutineFocusMode from '@/components/routine/routine-focus-mode';

export default function Routine() {
	const [routine, setRoutine] = useState<Routine>(emptyRoutine);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isFocusMode, setIsFocusMode] = useState(false);
	const [isFastMode, setIsFastMode] = useState(true);

	const params = useParams();
	const { user } = useAuth();

	useEffect(() => {
		if (!user || !params.routineId) return;

		const unsubscribeRoutine = fetchRoutine(user.uid, params.routineId, setRoutine);

		const unsubscribeTasks = fetchTasks(user.uid, params.routineId, setTasks);

		return () => {
			unsubscribeRoutine();
			unsubscribeTasks();
		};
	}, [params.routineId, routine.id, user]);

	if (!user) return;

	return (
		<>
			{isFocusMode && tasks.length ? (
				<RoutineFocusMode
					isFastMode={isFastMode}
					setIsFocusMode={setIsFocusMode}
					routine={routine}
					tasks={tasks}
				/>
			) : (
				<RoutineTaskList
					isFastMode={isFastMode}
					setIsFastMode={setIsFastMode}
					setIsFocusMode={setIsFocusMode}
					routine={routine}
					tasks={tasks}
					setTasks={setTasks}
				/>
			)}
		</>
	);
}
