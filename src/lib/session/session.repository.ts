import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Session } from '@/lib/session/session.type';
import { DB_PATH } from '@/lib/consts';

export function getSessionPath(userId: string, taskId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.TASKS}/${taskId}/${DB_PATH.SESSIONS}`;
}

export async function addSession(userId: string, taskId: string, session: Session) {
	const newSessionRef = doc(collection(db, getSessionPath(userId, taskId)));

	void setDoc(newSessionRef, session);
}

export async function editSession(userId: string, taskId: string, session: Session) {
	const sessionRef = doc(db, getSessionPath(userId, taskId), session.id);

	void setDoc(sessionRef, session);
}

export function fetchSessions(
	userId: string,
	taskId: string,
	setSessions: (sessions: Session[]) => void,
) {
	console.log('fetchSessions');
	const sessionsCollectionRef = query(
		collection(db, getSessionPath(userId, taskId)),
		orderBy('order'),
	);

	return onSnapshot(sessionsCollectionRef, (snapshot) => {
		const sessions: Session[] = [];
		snapshot.forEach((doc) => {
			sessions.push({ ...doc.data(), id: doc.id } as Session);
		});

		setSessions(sessions);
	});
}

export function deleteSession(userId: string, taskId: string, sessionId: string) {
	deleteDoc(doc(db, getSessionPath(userId, taskId), sessionId));
}
