import {
	resetSession as resetSessionRepo,
	startSession as startSessionRepo,
	stopSession as stopSessionRepo,
} from './session.repository';
import { Session } from '@/lib/session/session.type';
import { NonEmptyArray, safeThrow, safeThrowUnauthorized } from '@/lib/error-handle';
import { useAtomValue } from 'jotai/index';
import { currentUserDataAtom } from '@/lib/user/user.type';

export function useSessionActions(routineId?: string, taskId?: string) {
	const user = useAtomValue(currentUserDataAtom);

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
