'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/base/button';
import { Heading } from '@/components/base/heading';
import { RoutineForm } from '@/components/routine/routine-form';
import { emptyRoutine, type Routine } from '@/lib/routine/routine.type';

import { PlusIcon } from 'lucide-react';
import { useRoutines } from '@/lib/routine/routine.context';
import { RoutineTimeList } from '@/components/routine/routine-time-list';
import { RoutineRow } from '@/components/routine/routine-row';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useBackendStatus } from '@/lib/use-backend-status';

export default function Routines() {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const { routines, handleSort } = useRoutines();
	const { status } = useBackendStatus();

	const [groupedRoutines, setGroupedRoutines] = useState<Record<string, Routine[]>>({});

	useEffect(() => {
		const groups = routines.reduce(
			(acc, routine) => {
				const group = routine.group || '';
				if (!acc[group]) acc[group] = [];
				acc[group].push(routine);
				return acc;
			},
			{} as Record<string, Routine[]>,
		);
		setGroupedRoutines(groups);
	}, [routines]);

	function flattenGroupedRoutines(groups: Record<string, Routine[]>): Routine[] {
		return Object.entries(groups).flatMap(([group, routines]) =>
			routines.map((routine, index) => ({
				...routine,
				group,
				order: index,
			})),
		);
	}

	function handleAddRoutine() {
		setRoutineForm({ ...emptyRoutine });
	}

	function handleDragOver(event: Parameters<typeof move>[1]) {
		setGroupedRoutines(move(groupedRoutines, event));
	}

	function handleDragEnd() {
		const flat = flattenGroupedRoutines(groupedRoutines);
		handleSort(flat);
	}

	return (
		<>
			<Heading className="mb-4">Routines</Heading>

			<DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
				<div className="flex flex-col gap-2">
					{Object.entries(groupedRoutines).map(([group, routines]) => (
						<RoutineTimeList key={group} group={group}>
							{routines.map((routine, index) => (
								<RoutineRow group={group} index={index} routine={routine} key={routine.id} />
							))}
						</RoutineTimeList>
					))}
				</div>
			</DragDropProvider>

			<div className="fixed bottom-2 m-auto left-1/2 -translate-x-1/2 z-20">
				<Button
					isLoading={status === 'loading'}
					disabled={status === 'loading'}
					className="w-40"
					color="green"
					type="button"
					onClick={handleAddRoutine}
				>
					<PlusIcon className="w-5 h-5" />
					Routine
				</Button>
			</div>

			<RoutineForm routineIn={routineForm} setRoutineIn={setRoutineForm} />
		</>
	);
}
