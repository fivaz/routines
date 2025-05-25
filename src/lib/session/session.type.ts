import { getToday } from '@/lib/session/session.utils';
import { atomWithReducer } from 'jotai/utils';

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

function atomWithCompare<Value>(
	initialValue: Value,
	areEqual: (prev: Value, next: Value) => boolean,
) {
	return atomWithReducer(initialValue, (prev: Value, next: Value) => {
		if (areEqual(prev, next)) {
			return prev;
		}

		return next;
	});
}

// Usage
export const dateAtom = atomWithCompare<string>(getToday(), (a, b) => a === b);
