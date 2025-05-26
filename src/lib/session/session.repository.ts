import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Session } from '@/lib/session/session.type';
import { DB_PATH } from '@/lib/consts';
import { getToday } from '@/lib/session/session.utils';
import { Task } from '../task/task.type';
import { NonEmptyArray } from '@/lib/error-handle';

export function getSessionPath(userId: string, routineId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}/${routineId}/${DB_PATH.SESSIONS}`;
}

export function fetchSessions(
	userId: string,
	routineId: string,
	tasks: Task[],
	date: string,
	setSessions: (sessions: Session[]) => void,
) {
	const q = query(
		collection(db, getSessionPath(userId, routineId)),
		where('date', '==', date),
		where(
			'taskId',
			'in',
			tasks.map((task) => task.id),
		),
	);

	return onSnapshot(q, (snapshot) => {
		const sessions: Session[] = [];
		snapshot.forEach((doc) => {
			sessions.push({ ...doc.data(), id: doc.id } as Session);
		});

		setSessions(sessions);
	});
}

export async function startSession(userId: string, routineId: string, taskId: string) {
	const newSessionRef = doc(collection(db, getSessionPath(userId, routineId)));

	const newSession: Omit<Session, 'id'> = {
		date: getToday(),
		startAt: new Date().toISOString(),
		endAt: '',
		taskId,
	};

	void setDoc(newSessionRef, newSession);
}

export async function stopSession(userId: string, routineId: string, session: Session) {
	const sessionRef = doc(db, getSessionPath(userId, routineId), session.id);

	void setDoc(sessionRef, { ...session, endAt: new Date().toISOString() });
}

export async function resetSession(
	userId: string,
	routineId: string,
	sessions: NonEmptyArray<Session>,
) {
	sessions.forEach((session) => void deleteSession(userId, routineId, session.id));

	void startSession(userId, routineId, sessions[0].id);
}

export function deleteSession(userId: string, routineId: string, sessionId: string) {
	deleteDoc(doc(db, getSessionPath(userId, routineId), sessionId));
}
