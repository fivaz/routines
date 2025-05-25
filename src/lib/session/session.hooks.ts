import { useAuth } from '@/lib/user/auth-context';
import {
	startSession as startSessionRepo,
	stopSession as stopSessionRepo,
} from './session.repository';
import { Session } from '@/lib/session/session.type';
import { safeThrow, safeThrowUnauthorized } from '@/lib/error-handle';

export function useSessionActions(routineId?: string, taskId?: string) {
	const { user } = useAuth();

	async function startSession() {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId || !taskId) {
			return safeThrow('routine id or task id is missing');
		}
		return startSessionRepo(user.uid, routineId, taskId);
	}

	async function stopSession(session: Session) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId) {
			return safeThrow('routine id or task id is missing');
		}
		if (!session) {
			return safeThrow("session doesn't exist yet");
		}
		return stopSessionRepo(user.uid, routineId, session);
	}

	return { startSession, stopSession };
}
