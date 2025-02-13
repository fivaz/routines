export type Task = {
	id: string;
	name: string;
	image: string;
	durationInSeconds: number;
	order: number;
	createdAt: string;
	history: Record<
		string,
		{
			startAt: string;
			endAt: string;
		}
	>;
};

export const emptyTask: Task = {
	id: '',
	name: '',
	order: 0,
	image: '',
	durationInSeconds: 5 * 60,
	createdAt: new Date().toISOString(),
	history: {},
};
