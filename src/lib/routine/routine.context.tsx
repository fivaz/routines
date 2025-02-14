import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Routine, RoutineTime } from '@/lib/routine/routine.type';
import { fetchRoutines, updateTimedRoutines } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';

const RoutineContext = createContext<{
	routines: Routine[];
	timedRoutines: Record<RoutineTime, Routine[]>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleSort: (event: any) => void;
	setTimedRoutines: React.Dispatch<React.SetStateAction<Record<RoutineTime, Routine[]>>>;
}>({
	routines: [],
	timedRoutines: {
		morning: [],
		afternoon: [],
		evening: [],
	},
	handleSort: () => {},
	setTimedRoutines: () => {},
});

function timeRoutines(routines: Routine[]) {
	return {
		morning: routines
			.filter((routine) => routine.time === 'morning' || routine.time === undefined)
			.sort((a, b) => a.order - b.order),
		afternoon: routines
			.filter((routine) => routine.time === 'afternoon')
			.sort((a, b) => a.order - b.order),
		evening: routines
			.filter((routine) => routine.time === 'evening')
			.sort((a, b) => a.order - b.order),
	};
}

export function RoutineProvider({ children }: PropsWithChildren) {
	const { user } = useAuth();
	const [routines, setRoutines] = useState<Routine[]>([]);
	const [timedRoutines, setTimedRoutines] = useState<Record<RoutineTime, Routine[]>>({
		morning: [],
		afternoon: [],
		evening: [],
	});
	useEffect(() => {
		if (!user?.uid) return;

		const unsubscribe = fetchRoutines(user.uid, (routines) => {
			setRoutines(routines);
			setTimedRoutines(timeRoutines(routines));
		});

		return () => unsubscribe();
	}, [user]);

	function handleSort() {
		if (!user?.uid) return;
		void updateTimedRoutines(user.uid, timedRoutines);
	}

	return (
		<RoutineContext.Provider value={{ routines, timedRoutines, setTimedRoutines, handleSort }}>
			{children}
		</RoutineContext.Provider>
	);
}

export const useRoutines = () => useContext(RoutineContext);
