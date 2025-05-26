import {
	fetchSessions,
	resetSession as resetSessionRepo,
	startSession as startSessionRepo,
	stopSession as stopSessionRepo,
} from './session.repository';
import { dateAtom, Session } from '@/lib/session/session.type';
import { NonEmptyArray, safeThrow, safeThrowUnauthorized } from '@/lib/error-handle';
import { useAtomValue } from 'jotai/index';
import { currentUserAtom } from '@/lib/user/user.type';
import { atomEffect } from 'jotai-effect';
import { tasksAtom } from '@/lib/task/task.type';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { sessionsAtom } from '@/app/(dashboard)/routine/[routineId]/focus/service';

export const sessionsAtomEffect = atomEffect((get, set) => {
	const date = get(dateAtom);
	const tasks = get(tasksAtom);
	const user = get(currentUserAtom);
	const routineId = get(routineIdAtom);

	if (!user?.uid || tasks.length === 0 || !routineId) {
		set(sessionsAtom, []);
		return;
	}

	const unsubscribe = fetchSessions(user.uid, routineId, tasks, date, (sessions) =>
		set(sessionsAtom, sessions),
	);

	return () => unsubscribe();
});

export function useSessionActions(routineId?: string, taskId?: string) {
	const user = useAtomValue(currentUserAtom);

	function startSession() {
		if (!user?.uid) return safeThrowUnauthorized();
		if (!routineId || !taskId) return safeThrow('routine id or task id is missing');

		return startSessionRepo(user.uid, routineId, taskId);
	}

	function stopSession(session: Session) {
		if (!user?.uid) return safeThrowUnauthorized();
		if (!routineId) return safeThrow('routine id is missing');

		return stopSessionRepo(user.uid, routineId, session);
	}

	function resetSession(sessions: NonEmptyArray<Session>) {
		if (!user?.uid) return safeThrowUnauthorized();
		if (!routineId) return safeThrow('routine id is missing');

		return resetSessionRepo(user.uid, routineId, sessions);
	}

	return { startSession, endSession: stopSession, resetSession };
}
