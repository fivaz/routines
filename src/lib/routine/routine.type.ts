export type Routine = {
	id: string;
	name: string;
	createdAt: string;
	image: string;
};

export const emptyRoutine = {
	id: '',
	name: '',
	image: '',
	createdAt: new Date().toISOString(),
};
