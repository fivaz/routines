import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { fetchRoutines, reorderRoutines } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { arrayMove } from '@dnd-kit/sortable';

const RoutineContext = createContext<{
	routines: Routine[];
	handleReorder: (newIndex: number, oldIndex: number) => void;
}>({
	routines: [],
	handleReorder: () => {},
});

export function RoutineProvider({ children }: PropsWithChildren) {
	const { user } = useAuth();
	const [routines, setRoutines] = useState<Routine[]>([]);

	useEffect(() => {
		if (!user?.uid) return;

		const unsubscribe = fetchRoutines(user.uid, setRoutines);

		return () => unsubscribe();
	}, [user]);

	const handleReorder = async (oldIndex: number, newIndex: number) => {
		if (!routines || !user) return;

		const newRoutines = arrayMove(routines, oldIndex, newIndex);
		setRoutines(newRoutines);

		void reorderRoutines(user.uid, newRoutines);
	};

	return (
		<RoutineContext.Provider value={{ routines, handleReorder }}>
			{children}
		</RoutineContext.Provider>
	);
}

export const useRoutines = () => useContext(RoutineContext);
