'use client';
import { useState } from 'react';
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
	const { groupedRoutines, setGroupedRoutines, handleSort } = useRoutines();
	const { status } = useBackendStatus();

	function handleAddRoutine() {
		setRoutineForm({ ...emptyRoutine });
	}

	return (
		<>
			<Heading className="mb-4">Routines</Heading>

			<DragDropProvider
				onDragOver={(event) => setGroupedRoutines((items) => move(items, event))}
				onDragEnd={handleSort}
			>
				<div className="flex flex-col gap-2">
					{Object.entries(groupedRoutines).map(([group, routines]) => (
						<RoutineTimeList key={group} time={group}>
							{routines.map((routine, index) => (
								<RoutineRow time={group} index={index} routine={routine} key={routine.id} />
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
