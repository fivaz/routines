import { Category } from '@/lib/category/category.type';
import { atom } from 'jotai/index';

export type Routine = {
	id: string;
	name: string;
	createdAt: string;
	image: string;
	order: number;
	category: Category | null;
};

export const emptyRoutine: Routine = {
	id: '',
	name: '',
	category: null,
	image: '',
	order: 0,
	createdAt: new Date().toISOString(),
};

export const routinesAtom = atom<Routine[]>([]);

export const routineIdAtom = atom<string>('');

export const routineAtom = atom((get) => {
	const routines = get(routinesAtom);
	const routineId = get(routineIdAtom);
	return routines.find((routine) => routine.id === routineId);
});
