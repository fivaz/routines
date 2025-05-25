import { useAuth } from '@/lib/user/auth-context';
import {
	continueSession as continueSessionRepo,
	resetSession as resetSessionRepo,
	startSession as startSessionRepo,
	stopSession as stopSessionRepo,
} from './session.repository';
import { Session } from '@/lib/session/session.type';
import { safeThrow, safeThrowUnauthorized } from '@/lib/error-handle';

export function useSessionActions(routineId?: string, taskId?: string) {
	const { user } = useAuth();

	function startSession() {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId || !taskId) {
			return safeThrow('routine id or task id is missing');
		}
		return startSessionRepo(user.uid, routineId, taskId);
	}

	function stopSession(session: Session) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId) {
			return safeThrow('routine id is missing');
		}
		return stopSessionRepo(user.uid, routineId, session);
	}

	function continueSession(session: Session) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId) {
			return safeThrow('routine id is missing');
		}
		return continueSessionRepo(user.uid, routineId, session);
	}

	function resetSession(session: Session) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId) {
			return safeThrow('routine id is missing');
		}
		return resetSessionRepo(user.uid, routineId, session);
	}

	return { startSession, stopSession, resetSession, continueSession };
}
