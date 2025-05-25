import { Session } from '@/lib/session/session.type';
import { atom } from 'jotai';

export type Task = {
	id: string;
	name: string;
	image: string;
	durationInSeconds: number;
	order: number;
	createdAt: string;
	currentSession?: Session;
};

export const emptyTask: Task = {
	id: '',
	name: '',
	order: 0,
	image: '',
	durationInSeconds: 5 * 60,
	createdAt: new Date().toISOString(),
};

export type ImageFocus = 'person' | 'object';

export const tasksAtom = atom<Task[]>([]);
