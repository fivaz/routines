'use client';
import { useState } from 'react';
import { Button } from '@/components/base/button';
import { Text } from '@/components/base/text';
import { Heading } from '@/components/base/heading';
import { RoutineForm } from '@/components/routine/routine-form';
import { emptyRoutine, type Routine } from '@/lib/routine/routine.type';
import { RoutineRow } from '@/components/routine/routine-row';

import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PlusIcon } from 'lucide-react';
import { useRoutines } from '@/lib/routine/routine.context';

export default function Routines() {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const { routines, handleReorder } = useRoutines();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250, // Optional: Adds a delay before dragging starts (in ms)
				tolerance: 5, // Optional: Defines how much movement is needed to start dragging
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleAddRoutine() {
		setRoutineForm({ ...emptyRoutine, order: routines.length });
	}

	function handleDragEnd({ active, over }: DragEndEvent) {
		if (over && active.id !== over.id) {
			const oldIndex = routines.findIndex((r) => r.id === active.id);
			const newIndex = routines.findIndex((r) => r.id === over.id);
			handleReorder(oldIndex, newIndex);
		}
	}

	return (
		<>
			<Heading className="text-2xl font-bold mb-4 text-green-500">Routines</Heading>

			<div className="flex flex-col gap-2">
				<Text>Morning</Text>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={routines} strategy={verticalListSortingStrategy}>
						{routines.map((routine) => (
							<RoutineRow routine={routine} key={routine.id} />
						))}
					</SortableContext>
				</DndContext>
			</div>

			<div className="fixed bottom-2 m-auto left-1/2 -translate-x-1/2 z-20">
				<Button className="w-40" color="green" type="button" onClick={handleAddRoutine}>
					<PlusIcon className="w-5 h-5" />
					Routine
				</Button>
			</div>

			<RoutineForm routineIn={routineForm} setRoutineIn={setRoutineForm} />
		</>
	);
}
