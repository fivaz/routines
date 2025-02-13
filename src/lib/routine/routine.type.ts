export type Routine = {
	id: string;
	name: string;
	createdAt: string;
	image: string;
	order: number;
	totalDuration: number;
	taskCount: number;
};

export const emptyRoutine: Routine = {
	id: '',
	taskCount: 0,
	totalDuration: 0,
	name: '',
	image: '',
	order: 0,
	createdAt: new Date().toISOString(),
};
