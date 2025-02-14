'use client';
import { useEffect, useState } from 'react';
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

export default function Routines() {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const { routines } = useRoutines();
	const [timedRoutines, setTimedRoutines] = useState<Record<RoutineTime, Routine[]>>({
		morning: [],
		afternoon: [],
		evening: [],
	});

	useEffect(() => {
		setTimedRoutines({
			morning: routines
				.filter((routine) => routine.time === 'morning' || routine.time === undefined)
				.sort((a, b) => a.order - b.order),
			afternoon: routines
				.filter((routine) => routine.time === 'afternoon')
				.sort((a, b) => a.order - b.order),
			evening: routines
				.filter((routine) => routine.time === 'evening')
				.sort((a, b) => a.order - b.order),
		});
	}, [routines]);

	function handleAddRoutine() {
		setRoutineForm({ ...emptyRoutine, order: routines.length });
	}

	return (
		<>
			<Heading className="text-2xl font-bold mb-4 text-green-500">Routines</Heading>

			<DragDropProvider
				onDragOver={(event) => {
					setTimedRoutines((items) => move(items, event));
				}}
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
				<Button className="w-40" color="green" type="button" onClick={handleAddRoutine}>
					<PlusIcon className="w-5 h-5" />
					Routine
				</Button>
			</div>

			<RoutineForm routineIn={routineForm} setRoutineIn={setRoutineForm} />
		</>
	);
}
