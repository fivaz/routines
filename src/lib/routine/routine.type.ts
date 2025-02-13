export type RoutineTime = 'morning' | 'afternoon' | 'evening';

export type Routine = {
	id: string;
	name: string;
	createdAt: string;
	image: string;
	order: number;
	totalDuration: number;
	taskCount: number;
	time: RoutineTime;
};

export const emptyRoutine: Routine = {
	id: '',
	taskCount: 0,
	totalDuration: 0,
	name: '',
	time: 'morning',
	image: '',
	order: 0,
	createdAt: new Date().toISOString(),
};
