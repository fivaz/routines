import { atom } from 'jotai/index';
import { Session } from '@/lib/session/session.type';
import { atomEffect } from 'jotai-effect';
import { tasksAtom } from '@/lib/task/task.type';
import { currentUserAtom } from '@/lib/user/user.type';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { fetchSessions } from '@/lib/session/session.repository';

// sessions of the routine
export const sessionsAtom = atom<Session[]>([]);

//sessions of a given routine and tasks
export const sessionsAtomEffect = atomEffect((get, set) => {
	const tasks = get(tasksAtom);
	const user = get(currentUserAtom);
	const routineId = get(routineIdAtom);

	if (!user?.uid || tasks.length === 0 || !routineId) {
		set(sessionsAtom, []);
		return;
	}

	const unsubscribe = fetchSessions({
		userId: user.uid,
		routineId,
		tasks,
		setSessions: (sessions) => set(sessionsAtom, sessions),
	});

	return () => unsubscribe();
});
