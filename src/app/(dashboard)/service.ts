// app/(dashboard)/routine/[routineId]/focus/atoms.ts
import { atomWithStorage } from 'jotai/utils';

export type ActiveSession = {
	routineId: string;
	taskIndex: number;
} | null;

export const activeSessionAtom = atomWithStorage<ActiveSession>('active-session', null);
