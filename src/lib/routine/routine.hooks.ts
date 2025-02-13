import { useRoutines } from './routine.context';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export function useRoutine() {
	const { routines } = useRoutines();
	const { routineId } = useParams<{ routineId: string }>();
	return useMemo(() => {
		return routines.find((routine) => routine.id === routineId);
	}, [routineId, routines]);
}
