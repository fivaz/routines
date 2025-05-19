import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { fetchRoutines, updateTimedRoutines } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/user/auth-context';

const RoutineContext = createContext<{
	routines: Routine[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleSort: (event: any) => void;
}>({
	routines: [],
	handleSort: () => {},
});

export function RoutineProvider({ children }: PropsWithChildren) {
	const { user } = useAuth();
	const [routines, setRoutines] = useState<Routine[]>([]);
	useEffect(() => {
		if (!user?.uid) return;

		const unsubscribe = fetchRoutines(user.uid, (routines) => {
			setRoutines(routines);
		});

		return () => unsubscribe();
	}, [user]);

	function handleSort() {
		if (!user?.uid) return;
		void updateTimedRoutines(user.uid, {}); // timedRoutines removed; passing empty object or adjust as needed
	}

	return (
		<RoutineContext.Provider value={{ routines, handleSort }}>{children}</RoutineContext.Provider>
	);
}

export const useRoutines = () => useContext(RoutineContext);
