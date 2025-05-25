import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Session } from '@/lib/session/session.type';
import { DB_PATH } from '@/lib/consts';
import { getToday } from '@/lib/session/session.utils';

export function getSessionPath(userId: string, routineId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}/${routineId}/${DB_PATH.SESSIONS}`;
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
