import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { fetchRoutines, updateRoutines } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/user/auth-context';
import { safeThrowUnauthorized } from '@/lib/error-handle';

const RoutineContext = createContext<{
	routines: Routine[];
	handleSort: (routines: Routine[]) => void;
}>({
	routines: [],
	handleSort: () => {},
});

export function RoutineProvider({ children }: PropsWithChildren) {
	const { user } = useAuth();
	const [routines, setRoutines] = useState<Routine[]>([]);
	useEffect(() => {
		if (!user?.uid) {
			return;
		}

		const unsubscribe = fetchRoutines(user.uid, (routines) => {
			setRoutines(routines);
		});

		return () => unsubscribe();
	}, [user]);

	function handleSort(routines: Routine[]) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		void updateRoutines(user.uid, routines);
	}

	return (
		<RoutineContext.Provider value={{ routines, handleSort }}>{children}</RoutineContext.Provider>
	);
}

export const useRoutines = () => useContext(RoutineContext);
