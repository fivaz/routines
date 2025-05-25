import { useAuth } from '@/lib/user/auth-context';
import {
	addRoutine as addRoutineRepo,
	deleteRoutine as deleteRoutineRepo,
	editRoutine as editRoutineRepo,
	fetchRoutines,
	updateRoutines as updateRoutinesRepo,
} from './routine.repository';
import { Routine, routinesAtom } from '@/lib/routine/routine.type';
import { safeThrowUnauthorized } from '@/lib/error-handle';
import { atomEffect } from 'jotai-effect';
import { currentUserAtom } from '@/lib/user/user.type';
import { tasksAtom } from '@/lib/task/task.type';

export const routinesAtomEffect = atomEffect((get, set) => {
	const user = get(currentUserAtom);

	if (!user?.uid) {
		set(tasksAtom, []);
		return;
	}

	const unsubscribe = fetchRoutines(user.uid, (routines) => set(routinesAtom, routines));

	return () => unsubscribe();
});

export function useRoutineActions() {
	const { user } = useAuth();

	async function deleteRoutine(routineId: string) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		return deleteRoutineRepo(user.uid, routineId);
	}

	async function editRoutine(routine: Routine, imageFile: File | null) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		return editRoutineRepo(user.uid, routine, imageFile);
	}

	async function updateRoutines(routines: Routine[]) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		return updateRoutinesRepo(user.uid, routines);
	}

	async function addRoutine(routine: Routine, imageFile: File | null) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		return addRoutineRepo(user.uid, routine, imageFile);
	}

	return { deleteRoutine, editRoutine, addRoutine, updateRoutines };
}
