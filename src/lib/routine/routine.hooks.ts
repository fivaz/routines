import { useRoutines } from './routine.context';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/lib/user/auth-context';
import {
	addRoutine as addRoutineRepo,
	deleteRoutine as deleteRoutineRepo,
	editRoutine as editRoutineRepo,
} from './routine.repository';
import { Routine } from '@/lib/routine/routine.type';

export function useRoutine() {
	const { routines } = useRoutines();
	const { routineId } = useParams<{ routineId: string }>();
	return useMemo(() => {
		return routines.find((routine) => routine.id === routineId);
	}, [routineId, routines]);
}

export function useRoutineActions() {
	const { user } = useAuth();

	async function deleteRoutine(routineId: string) {
		if (!user?.uid) {
			console.log('No authenticated user found');
			return;
		}
		return deleteRoutineRepo(user.uid, routineId);
	}

	async function editRoutine(routine: Routine, imageFile: File | null) {
		if (!user?.uid) {
			console.log('No authenticated user found');
			return;
		}
		return editRoutineRepo(user.uid, routine, imageFile);
	}

	async function addRoutine(routine: Routine, imageFile: File | null) {
		if (!user?.uid) {
			console.log('No authenticated user found');
			return;
		}
		return addRoutineRepo(user.uid, routine, imageFile);
	}

	return { deleteRoutine, editRoutine, addRoutine };
}
