import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { fetchRoutines } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';

const RoutineContext = createContext<{
	routines: Routine[];
	setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
}>({
	routines: [],
	setRoutines: () => {},
});

export function RoutineProvider({ children }: PropsWithChildren) {
	const { user } = useAuth();
	const [routines, setRoutines] = useState<Routine[]>([]);

	useEffect(() => {
		if (!user?.uid) return;

		const unsubscribe = fetchRoutines(user.uid, setRoutines);

		return () => unsubscribe();
	}, [user]);

	return (
		<RoutineContext.Provider value={{ routines, setRoutines }}>{children}</RoutineContext.Provider>
	);
}

export const useRoutines = () => useContext(RoutineContext);
