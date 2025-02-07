'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/base/button';
import { RoutineForm } from '@/components/routine/routine-form';
import { emptyRoutine, type Routine } from '@/lib/routine/routine.type';
import { fetchRoutines, updateRoutines } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { RoutineRow } from '@/components/routine/routine-row';

import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PlusIcon } from 'lucide-react';
import { reorderRoutines } from '@/lib/routine/routine.utils';

export default function Routines() {
	const [routines, setRoutines] = useState<Routine[]>([]);

	const [routineForm, setRoutineForm] = useState<Routine | null>(null);

	const { user } = useAuth();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleAddRoutine() {
		setRoutineForm(emptyRoutine);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!user) return;

		if (over && active.id !== over.id) {
			setRoutines((routines) => reorderRoutines(routines, over.id, active.id));

			void updateRoutines(user.uid, reorderRoutines(routines, over.id, active.id));
		}
	}

	useEffect(() => {
		if (!user) return;

		const unsubscribe = fetchRoutines(user.uid, setRoutines);

		return () => unsubscribe();
	}, [user]);

	return (
		<>
			<h1 className="text-2xl font-bold mb-4 text-green-500">Routines</h1>

			<div className="flex flex-col gap-2">
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={routines} strategy={verticalListSortingStrategy}>
						{routines.map((routine) => (
							<RoutineRow routine={routine} key={routine.id} />
						))}
					</SortableContext>
				</DndContext>
			</div>

			<div className="absolute bottom-2 m-auto left-1/2 -translate-x-1/2">
				<Button className="w-40" color="green" type="button" onClick={handleAddRoutine}>
					<PlusIcon className="w-5 h-5" />
					Routine
				</Button>
			</div>

			<RoutineForm routineIn={routineForm} setRoutineIn={setRoutineForm} />
		</>
	);
}
