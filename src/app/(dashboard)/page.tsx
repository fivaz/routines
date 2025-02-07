'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { Button } from '@/components/base/button';
import { RoutineForm } from '@/components/routine/routine-form';
import { type Routine } from '@/lib/routine/routine.type';
import { DB_PATH } from '@/lib/consts';
import { getRoutinePath, updateRoutines } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { PlusIcon } from '@heroicons/react/16/solid';
import { RoutineRow } from '@/components/routine/routine-row';

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	UniqueIdentifier,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function Routines() {
	const [loading, setLoading] = useState(true);
	const [routines, setRoutines] = useState<Routine[]>([]);

	const [isRoutineFormOpen, setIsRoutineFormOpen] = useState(false);

	const { user } = useAuth();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function reorderRoutines(
		routines: Routine[],
		overId: UniqueIdentifier,
		activeId: UniqueIdentifier,
	) {
		const oldIndex = routines.findIndex((routine) => routine.id === String(activeId));
		const newIndex = routines.findIndex((routine) => routine.id === String(overId));

		return arrayMove(routines, oldIndex, newIndex);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!user) return;

		if (over && active.id !== over.id) {
			setRoutines((routines) => reorderRoutines(routines, over.id, active.id));

			updateRoutines(user.uid, reorderRoutines(routines, over.id, active.id));
		}
	}

	function sortRoutines(routines: Routine[]) {
		return routines.toSorted((a, b) => a.order - b.order);
	}

	useEffect(() => {
		if (!user) return;

		const routineCollectionRef = collection(db, getRoutinePath(user.uid));

		const unsubscribe = onSnapshot(routineCollectionRef, (snapshot) => {
			const routineData: Routine[] = [];
			snapshot.forEach((doc) => {
				routineData.push({ ...doc.data(), id: doc.id } as Routine);
			});

			setRoutines(sortRoutines(routineData));
			setLoading(false);
		});

		return () => unsubscribe();
	}, [user]);

	if (loading) return <div>Loading...</div>;

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
				<Button
					className="w-40"
					color="green"
					type="button"
					onClick={() => setIsRoutineFormOpen(true)}
				>
					<PlusIcon />
					New Routine
				</Button>
			</div>

			<RoutineForm isOpen={isRoutineFormOpen} setIsOpen={setIsRoutineFormOpen} />
		</>
	);
}
