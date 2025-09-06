'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/base/button';
import { Heading } from '@/components/base/heading';
import { RoutineForm } from '@/components/routine/routine-form';
import { emptyRoutine, type Routine, routinesAtom } from '@/lib/routine/routine.type';

import { PlusIcon } from 'lucide-react';
import { move } from '@dnd-kit/helpers';
import { useBackendStatus } from '@/lib/use-backend-status';
import { flattenRoutinesByCategory, groupRoutinesByCategory } from '@/lib/category/category.utils';
import {
	categoriesAtom,
	Category,
	noCategory,
	UNCATEGORIZED_KEY,
} from '@/lib/category/category.type';
import { DragDropProvider } from '@dnd-kit/react';
import { RoutineCategory } from '@/app/(dashboard)/routine/routine-category';
import { RoutineRow } from '@/app/(dashboard)/routine/routine-row';
import { useAtom, useAtomValue } from 'jotai';
import { useRoutineActions } from '@/lib/routine/routine.hooks';
import { useCategoryActions } from '@/lib/category/category.hooks';
import { RoutineListSkeleton } from '@/app/(dashboard)/RoutineListSkeleton';
import { activeSessionAtom } from '@/app/(dashboard)/service';
import useRouterWithQuery from '@/lib/utils.hook';
import { Routes } from '@/lib/consts';
import { taskIndexAtom } from '@/app/(dashboard)/routine/[routineId]/focus/service';
import { useParams } from 'next/navigation';
import ColdStartRestorer from '@/app/(dashboard)/ColdStartRestorer';

export default function Routines() {
	const [routineForm, setRoutineForm] = useState<Routine | null>(null);
	const [routines, setRoutines] = useAtom(routinesAtom);
	const [categories, setCategories] = useAtom(categoriesAtom);
	const { status } = useBackendStatus();
	const { updateRoutines } = useRoutineActions();
	const { updateCategories } = useCategoryActions();

	const [routinesByCategories, setRoutinesByCategories] = useState<Record<string, Routine[]>>({});
	const [sortedCategories, setSortedCategories] = useState<Category[]>([]);

	useEffect(() => {
		const fullCategories = [...categories, noCategory];

		setSortedCategories(fullCategories);

		setRoutinesByCategories(groupRoutinesByCategory(routines, fullCategories));
	}, [categories, routines]);

	function handleAddRoutine() {
		setRoutineForm({ ...emptyRoutine, createdAt: new Date().toISOString() });
	}

	function handleDragOver(event: Parameters<typeof move>[1]) {
		const { source } = event.operation;

		if (source?.type === 'column') return;

		const sortedRoutinesByCategories = move(routinesByCategories, event);

		setRoutinesByCategories(sortedRoutinesByCategories);

		const newRoutines = flattenRoutinesByCategory(sortedRoutinesByCategories, categories);
		setRoutines(newRoutines);
		//persist routines order
		void updateRoutines(newRoutines);
	}

	function handleDragEnd(event: Parameters<typeof move>[1] & { canceled: boolean }) {
		const { source } = event.operation;

		if (event.canceled || source?.type !== 'column') return;

		const resortedCategories = move(sortedCategories, event);

		setSortedCategories(resortedCategories);

		const newCategories = resortedCategories.filter(
			(category) => category.id !== UNCATEGORIZED_KEY,
		);
		//persist category order
		setCategories(newCategories);
		void updateCategories(newCategories);
	}

	return (
		<>
			<Heading className="mb-4">Routines</Heading>

			<RoutineListSkeleton />

			<ColdStartRestorer />

			<DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
				<div className="flex flex-col gap-2">
					{sortedCategories.map((category, categoryIndex) => (
						<RoutineCategory key={category.id} category={category} index={categoryIndex}>
							{routinesByCategories[category.id]?.map((routine, index) => (
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

			<div className="fixed bottom-2 left-1/2 z-20 m-auto -translate-x-1/2">
				<Button
					isLoading={status === 'loading'}
					disabled={status === 'loading'}
					className="w-40"
					color="green"
					type="button"
					onClick={handleAddRoutine}
				>
					<PlusIcon className="h-5 w-5" />
					Routine
				</Button>
			</div>

			<RoutineForm routineIn={routineForm} setRoutineIn={setRoutineForm} />
		</>
	);
}
