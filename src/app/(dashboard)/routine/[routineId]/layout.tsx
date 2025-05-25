'use client';
import { PropsWithChildren, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/user/auth-context';
import { useFetchTasks } from '@/lib/task/task.hooks';
import { sessionsAtomEffect } from '@/lib/session/session.utils';
import { useAtom, useSetAtom } from 'jotai';
import { routineIdAtom } from '@/lib/routine/routine.type';

export default function RoutineLayout({ children }: PropsWithChildren) {
	const { routineId } = useParams<{ routineId: string }>();
	const setRoutineId = useSetAtom(routineIdAtom);
	const { user } = useAuth();

	useEffect(() => {
		if (routineId) setRoutineId(routineId);
	}, [routineId, setRoutineId]);

	useFetchTasks(user?.uid, routineId); // fetch + populate tasksAtom here

	useAtom(sessionsAtomEffect);

	return <>{children}</>;
}
