import { Routine } from '@/lib/routine/routine.type';
import { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function sortRoutines(routines: Routine[]) {
	return routines.toSorted((a, b) => a.order - b.order);
}

export function reorderRoutines(
	routines: Routine[],
	overId: UniqueIdentifier,
	activeId: UniqueIdentifier,
) {
	const oldIndex = routines.findIndex((routine) => routine.id === String(activeId));
	const newIndex = routines.findIndex((routine) => routine.id === String(overId));

	return arrayMove(routines, oldIndex, newIndex);
}
