import { Category } from '@/lib/category/category.type';

export type Routine = {
	id: string;
	name: string;
	createdAt: string;
	image: string;
	order: number;
	totalDuration: number;
	taskCount: number;
	category: Category | null;
};

export const emptyRoutine: Routine = {
	id: '',
	taskCount: 0,
	totalDuration: 0,
	name: '',
	category: null,
	image: '',
	order: 0,
	createdAt: new Date().toISOString(),
};
