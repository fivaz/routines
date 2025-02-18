'use client';
import { useState } from 'react';
import { Button } from '@/components/base/button';
import { Heading } from '@/components/base/heading';
import { RoutineForm } from '@/components/routine/routine-form';
import { emptyRoutine, type Routine, RoutineTime } from '@/lib/routine/routine.type';

import { PlusIcon } from 'lucide-react';
import { useRoutines } from '@/lib/routine/routine.context';
import { RoutineTimeList } from '@/components/routine/routine-time-list';
import { RoutineRow } from '@/components/routine/routine-row';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import useBackendStatus from '@/lib/use-backend-status';

export default function Routines() {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const { timedRoutines, setTimedRoutines, handleSort } = useRoutines();
	const { status } = useBackendStatus();

	function handleAddRoutine() {
		setRoutineForm({ ...emptyRoutine });
	}

	return (
		<>
			<Heading className="mb-4">Routines</Heading>

			<DragDropProvider
				onDragOver={(event) => setTimedRoutines((items) => move(items, event))}
				onDragEnd={handleSort}
			>
				<div className="flex flex-col gap-2">
					{Object.entries(timedRoutines).map(([time, routines]) => (
						<RoutineTimeList key={time} time={time as RoutineTime}>
							{routines.map((routine, index) => (
								<RoutineRow
									time={time as RoutineTime}
									index={index}
									routine={routine}
									key={routine.id}
								/>
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
