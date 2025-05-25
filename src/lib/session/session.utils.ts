import { atomEffect } from 'jotai-effect';
import { Session } from '@/lib/session/session.type';
import { tasksAtom } from '@/lib/task/task.type';
import { currentUserAtom } from '../user/user.type';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { sessionsAtom } from '@/app/(dashboard)/routine/[routineId]/new-focus/service';
import { fetchSessions } from '@/lib/session/session.repository';
import { differenceInSeconds, parseISO } from 'date-fns';

export function getToday(): string {
	return new Date().toISOString().split('T')[0];
}

export const sessionsAtomEffect = atomEffect((get, set) => {
	const tasks = get(tasksAtom);
	const user = get(currentUserAtom);
	const routineId = get(routineIdAtom);

	if (!user?.uid || tasks.length === 0 || !routineId) {
		set(sessionsAtom, []);
		return;
	}

	const unsubscribe = fetchSessions(user.uid, routineId, tasks, (sessions) =>
		set(sessionsAtom, sessions),
	);

	return () => unsubscribe();
});

export function getSessionDuration(session?: Session): number {
	if (!session) {
		return 0;
	}

	const start = session?.startAt ? parseISO(session.startAt) : null;
	const end = session?.endAt ? parseISO(session.endAt) : null;

	if (!start) {
		return 0;
	}

	const now = new Date();
	return differenceInSeconds(end ?? now, start);
}
