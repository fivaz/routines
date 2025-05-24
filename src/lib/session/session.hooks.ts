import { useAuth } from '@/lib/user/auth-context';
import {
	addSession as addSessionRepo,
	deleteSession as deleteSessionRepo,
	editSession as editSessionRepo,
	fetchSessions,
	startSession as startSessionRepo,
	stopSession as stopSessionRepo,
} from './session.repository';
import { Session } from '@/lib/session/session.type';
import { safeThrow, safeThrowUnauthorized } from '@/lib/error-handle';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTasks } from '@/lib/task/task.context';

export function useSessions() {
	const { user } = useAuth();
	const { routineId } = useParams<{ routineId: string }>();
	const { tasks } = useTasks();

	const [sessions, setSessions] = useState<Session[]>([]);

	useEffect(() => {
		if (!user?.uid || !tasks.length) {
			setSessions([]);
			return;
		}

		const unsubscribe = fetchSessions(user.uid, routineId, tasks, setSessions);

		return () => unsubscribe();
	}, [user?.uid, routineId, tasks.length, tasks]);

	return { sessions, setSessions };
}

export function useSessionActions(routineId?: string, taskId?: string) {
	const { user } = useAuth();

	async function deleteSession(sessionId: string) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId || !taskId) {
			return safeThrow('routine id or task id is missing');
		}
		return deleteSessionRepo(user.uid, routineId, taskId, sessionId);
	}

	async function editSession(session: Session) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId || !taskId) {
			return safeThrow('routine id or task id is missing');
		}
		return editSessionRepo(user.uid, routineId, taskId, session);
	}

	async function addSession(session: Session) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId || !taskId) {
			return safeThrow('routine id or task id is missing');
		}
		return addSessionRepo(user.uid, routineId, taskId, session);
	}

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
		if (!routineId || !taskId) {
			return safeThrow('routine id or task id is missing');
		}
		if (!session) {
			return safeThrow("session doesn't exist yet");
		}
		return stopSessionRepo(user.uid, routineId, taskId, session);
	}

	return { deleteSession, editSession, addSession, startSession, stopSession };
}
