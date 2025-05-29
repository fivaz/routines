import {
	addRoutine as addRoutineRepo,
	deleteRoutine as deleteRoutineRepo,
	editRoutine as editRoutineRepo,
	fetchRoutines,
	updateRoutines as updateRoutinesRepo,
} from './routine.repository';
import { Routine, routinesAtom, routinesLoadingAtom } from '@/lib/routine/routine.type';
import { safeThrowUnauthorized } from '@/lib/error-handle';
import { atomEffect } from 'jotai-effect';
import { currentUserDataAtom } from '@/lib/user/user.type';
import { useAtomValue } from 'jotai';

export const routinesAtomEffect = atomEffect((get, set) => {
	const user = get(currentUserDataAtom);

	if (!user?.uid) {
		set(routinesAtom, []);
		set(routinesLoadingAtom, false);
		return;
	}

	// ⏳ Start loading
	set(routinesLoadingAtom, true);

	const unsubscribe = fetchRoutines(user.uid, (routines) => {
		set(routinesAtom, routines);
		set(routinesLoadingAtom, false); // ✅ Done loading
	});

	return () => {
		unsubscribe();
		set(routinesLoadingAtom, false); // Optional: cleanup resets loading
	};
});

export function useRoutineActions() {
	const user = useAtomValue(currentUserDataAtom);

	async function deleteRoutine(routineId: string) {
		if (!user?.uid) return safeThrowUnauthorized();
		return deleteRoutineRepo(user.uid, routineId);
	}

	async function editRoutine(routine: Routine, imageFile: File | null) {
		if (!user?.uid) return safeThrowUnauthorized();
		return editRoutineRepo(user.uid, routine, imageFile);
	}

	async function updateRoutines(routines: Routine[]) {
		if (!user?.uid) return safeThrowUnauthorized();
		return updateRoutinesRepo(user.uid, routines);
	}

	async function addRoutine(routine: Routine, imageFile: File | null) {
		if (!user?.uid) return safeThrowUnauthorized();
		return addRoutineRepo(user.uid, routine, imageFile);
	}

	return { deleteRoutine, editRoutine, addRoutine, updateRoutines };
}
