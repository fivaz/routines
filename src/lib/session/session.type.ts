export type Session = {
	id: string;
	date: string;
	startAt: string;
	endAt: string;
	taskId: string;
};

export const emptySession: Session = {
	id: '',
	date: '',
	startAt: '',
	endAt: '',
	taskId: '',
};
