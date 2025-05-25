import { atomEffect } from 'jotai-effect';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Session } from '@/lib/session/session.type';
import { tasksAtom } from '@/lib/task/task.type';
import { currentUserAtom } from '../user/user.type';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { sessionsAtom } from '@/app/(dashboard)/routine/[routineId]/new-focus/service';
import { getSessionPath } from '@/lib/session/session.repository';
import { differenceInSeconds, parseISO } from 'date-fns';

export function getToday(): string {
	return new Date().toISOString().split('T')[0];
}

export const sessionsAtomEffect = atomEffect((get, set) => {
	const tasks = get(tasksAtom);
	const user = get(currentUserAtom); // assuming you made an atom for the current user
	const routineId = get(routineIdAtom);

	if (!user?.uid || tasks.length === 0 || !routineId) {
		set(sessionsAtom, []);
		return;
	}

	const q = query(
		collection(db, getSessionPath(user.uid, routineId)),
		where('date', '==', getToday()),
		where(
			'taskId',
			'in',
			tasks.map((task) => task.id),
		),
	);

	const unsubscribe = onSnapshot(q, (snapshot) => {
		const sessions: Session[] = [];
		snapshot.forEach((doc) => {
			sessions.push({ ...doc.data(), id: doc.id } as Session);
		});

		set(sessionsAtom, sessions);
	});

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
