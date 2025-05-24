export type Session = {
	id: string;
	date: string;
	startAt: string;
	endAt: string;
};

export const emptySession: Session = {
	id: '',
	date: '',
	startAt: '',
	endAt: '',
};
