'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/base/button';
import { Heading } from '@/components/base/heading';
import { RoutineForm } from '@/components/routine/routine-form';
import { emptyRoutine, type Routine } from '@/lib/routine/routine.type';

import { PlusIcon } from 'lucide-react';
import { useRoutines } from '@/lib/routine/routine.context';
import { RoutineCategory } from '@/app/(dashboard)/routine/routine-category';
import { RoutineRow } from '@/app/(dashboard)/routine/routine-row';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useBackendStatus } from '@/lib/use-backend-status';
import { useCategories } from '@/lib/category/category.context';
import { flattenRoutinesByCategory, groupRoutinesByCategory } from '@/lib/category/category.utils';
import { Category } from '@/lib/category/category.type';

export default function Routines() {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const { routines, handleRoutinesSort } = useRoutines();
	const { categories, handleCategorySort } = useCategories();
	const { status } = useBackendStatus();

	const [routinesByCategories, setRoutinesByCategories] = useState<Record<string, Routine[]>>({});
	const [sortedCategories, setSortedCategories] = useState<Category[]>([]);

	useEffect(() => {
		setSortedCategories(categories);

		setRoutinesByCategories(groupRoutinesByCategory(routines, categories));
	}, [categories, routines]);

	function handleAddRoutine() {
		setRoutineForm({ ...emptyRoutine, createdAt: new Date().toISOString() });
	}

	function handleDragOver(event: Parameters<typeof move>[1]) {
		const { source } = event.operation;

		if (source?.type === 'column') return;

		const sortedRoutinesByCategories = move(routinesByCategories, event);

		setRoutinesByCategories(sortedRoutinesByCategories);

		//persist routines order
		handleRoutinesSort(flattenRoutinesByCategory(sortedRoutinesByCategories, categories));
	}

	function handleDragEnd(event: Parameters<typeof move>[1] & { canceled: boolean }) {
		const { source } = event.operation;

		if (event.canceled || source?.type !== 'column') return;

		const resortedCategories = move(sortedCategories, event);

		setSortedCategories(resortedCategories);

		//persist category order
		handleCategorySort(resortedCategories);
	}

	return (
		<>
			<Heading className="mb-4">Routines</Heading>

			<DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
				<div className="flex flex-col gap-2">
					{sortedCategories.map((category, categoryIndex) => (
						<RoutineCategory key={category.id} category={category} index={categoryIndex}>
							{routinesByCategories[category.id].map((routine, index) => (
								<RoutineRow
									categoryId={category.id}
									index={index}
									routine={routine}
									key={routine.id}
								/>
							))}
						</RoutineCategory>
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
