import { atom } from 'jotai';
import { User } from 'firebase/auth';

export const currentUserAtom = atom<{ data: User | null; loading: boolean }>({
	data: null,
	loading: false,
});

export const currentUserDataAtom = atom((get) => get(currentUserAtom).data);
