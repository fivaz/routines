import { atom } from 'jotai';
import { User } from 'firebase/auth';

export const currentUserAtom = atom<User | null>(null);

export const loadingAuthAtom = atom(true);
