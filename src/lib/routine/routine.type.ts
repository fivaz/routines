export type Routine = {
	id: string;
	name: string;
	createdAt: string;
	image: string;
	order: number;
};

export const emptyRoutine = {
	id: '',
	name: '',
	image: '',
	order: 0,
	createdAt: new Date().toISOString(),
};
