export type Routine = {
	id: string;
	name: string;
	createdAt: string;
	image: string;
	order: number;
};

export const emptyRoutine: Routine = {
	id: '',
	name: '',
	image: '',
	order: 0,
	createdAt: new Date().toISOString(),
};
