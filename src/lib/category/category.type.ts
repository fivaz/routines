export type Category = {
	id: string;
	name: string;
	createdAt: string;
	order: number;
};

export const emptyCategory: Category = {
	id: '',
	name: '',
	order: 0,
	createdAt: new Date().toISOString(),
};

export const UNCATEGORIZED_KEY = 'uncategorized';

export const noCategory: Category = {
	id: UNCATEGORIZED_KEY,
	name: UNCATEGORIZED_KEY,
	order: 0,
	createdAt: new Date().toISOString(),
};
