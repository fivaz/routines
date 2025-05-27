'use client';
import { PropsWithChildren, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { tasksAtomEffect } from '@/lib/task/task.hooks';
import { useAtom, useSetAtom } from 'jotai';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { currentSessionsAtomEffect } from '@/app/(dashboard)/routine/[routineId]/focus/service';

export default function RoutineLayout({ children }: PropsWithChildren) {
	const { routineId } = useParams<{ routineId: string }>();
	const setRoutineId = useSetAtom(routineIdAtom);

	useEffect(() => {
		if (routineId) setRoutineId(routineId);
	}, [routineId, setRoutineId]);

	useAtom(tasksAtomEffect);
	useAtom(currentSessionsAtomEffect);

	return <>{children}</>;
}
