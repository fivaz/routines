'use client';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import { fetchRoutine } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { emptyRoutine, type Routine } from '@/lib/routine/routine.type';

import { Task } from '@/lib/task/task.type';

import { fetchTasks } from '@/lib/task/task.repository';

import RoutineTaskListPage from '@/components/routine/routine-task-list-page';
import RoutineFocusPage from '@/components/routine/routine-focus-page/index';
import { Index } from '@/components/routine/routine-recap-page';

export default function Routine() {
	const [routine, setRoutine] = useState<Routine>(emptyRoutine);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [page, setPage] = useState<'focus' | 'recap' | 'list'>('recap');

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
			{page === 'list' && (
				<RoutineTaskListPage
					setPage={setPage}
					routine={routine}
					tasks={tasks}
					setTasks={setTasks}
				/>
			)}

			{page === 'focus' && <RoutineFocusPage setPage={setPage} routine={routine} tasks={tasks} />}

			{page === 'recap' && <Index setPage={setPage} tasks={tasks} />}
		</>
	);
}
