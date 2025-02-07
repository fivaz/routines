export type Task = {
	id: string;
	name: string;
	image: string;
	durationInSeconds: number;
	createdAt: string;
	history: {
		startAt: string;
		endAt: string;
	}[];
};

export const emptyTask: Task = {
	id: '',
	name: '',
	image: '',
	durationInSeconds: 5 * 60,
	createdAt: new Date().toISOString(),
	history: [],
};
