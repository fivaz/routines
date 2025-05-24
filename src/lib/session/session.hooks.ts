import { useSessions } from './session.context';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/lib/user/auth-context';
import {
	addSession as addSessionRepo,
	deleteSession as deleteSessionRepo,
	editSession as editSessionRepo,
} from './session.repository';
import { Session } from '@/lib/session/session.type';
import { safeThrowUnauthorized } from '@/lib/error-handle';

export function useSession() {
	const { sessions } = useSessions();
	const { sessionId } = useParams<{ sessionId: string }>();
	return useMemo(() => {
		return sessions.find((session) => session.id === sessionId);
	}, [sessionId, sessions]);
}

export function useSessionActions(taskId: string) {
	const { user } = useAuth();

	async function deleteSession(sessionId: string) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		return deleteSessionRepo(user.uid, taskId, sessionId);
	}

	async function editSession(session: Session) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		return editSessionRepo(user.uid, taskId, session);
	}

	async function addSession(session: Session) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		return addSessionRepo(user.uid, taskId, session);
	}

	return { deleteSession, editSession, addSession };
}
