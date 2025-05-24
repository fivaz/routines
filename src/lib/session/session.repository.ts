import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Session } from '@/lib/session/session.type';
import { DB_PATH } from '@/lib/consts';
import { Task } from '../task/task.type';
import { getToday } from '@/lib/session/session.utils';

export function getSessionPath(userId: string, routineId: string, taskId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}/${routineId}/${DB_PATH.TASKS}/${taskId}/${DB_PATH.SESSIONS}`;
}

export async function startSession(userId: string, routineId: string, taskId: string) {
	const newSessionRef = doc(collection(db, getSessionPath(userId, routineId, taskId)));

	const newSession: Omit<Session, 'id'> = {
		date: getToday(),
		startAt: new Date().toISOString(),
		endAt: '',
		taskId,
	};

	void setDoc(newSessionRef, newSession);
}

export async function stopSession(
	userId: string,
	routineId: string,
	taskId: string,
	session: Session,
) {
	const sessionRef = doc(db, getSessionPath(userId, routineId, taskId), session.id);

	void setDoc(sessionRef, { ...session, endAt: new Date().toISOString() });
}

export async function addSession(
	userId: string,
	routineId: string,
	taskId: string,
	session: Session,
) {
	const newSessionRef = doc(collection(db, getSessionPath(userId, routineId, taskId)));

	void setDoc(newSessionRef, session);
}

export async function editSession(
	userId: string,
	routineId: string,
	taskId: string,
	session: Session,
) {
	const sessionRef = doc(db, getSessionPath(userId, routineId, taskId), session.id);

	void setDoc(sessionRef, session);
}

export async function fetchSessionsForToday(
	userId: string,
	routineId: string,
	tasks: Task[],
	date: string,
	setTasks: (tasks: Task[]) => void,
) {
	const updatedTasks: Task[] = [];

	for (const task of tasks) {
		const sessionsRef = collection(db, getSessionPath(userId, routineId, task.id));

		const q = query(sessionsRef, where('date', '==', date), limit(1));

		const sessionSnap = await getDocs(q);
		const session = {
			...sessionSnap.docs[0]?.data(),
			id: sessionSnap.docs[0]?.id,
		} as Session;

		updatedTasks.push({
			...task,
			currentSession: session,
		});
	}

	setTasks(updatedTasks);
}

export function fetchSessions(
	userId: string,
	routineId: string,
	taskId: string,
	setSessions: (sessions: Session[]) => void,
) {
	console.log('fetchSessions');
	const sessionsCollectionRef = query(
		collection(db, getSessionPath(userId, routineId, taskId)),
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

export function deleteSession(
	userId: string,
	routineId: string,
	taskId: string,
	sessionId: string,
) {
	deleteDoc(doc(db, getSessionPath(userId, routineId, taskId), sessionId));
}
