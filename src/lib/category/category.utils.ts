import { Routine } from '@/lib/routine/routine.type';
import { Category, UNCATEGORIZED_KEY } from '@/lib/category/category.type';

export function groupRoutinesByCategory(
	routines: Routine[],
	categories: Category[],
): Record<string, Routine[]> {
	const grouped: Record<string, Routine[]> = {};

	// Initialize categories with empty arrays
	for (const category of categories) {
		grouped[category.id] = [];
	}

	// Assign routines to their category group
	for (const routine of routines) {
		const categoryKey = routine.category?.id ?? UNCATEGORIZED_KEY;
		if (!grouped[categoryKey]) {
			grouped[categoryKey] = [];
		}
		grouped[categoryKey].push(routine);
	}

	return grouped;
}

export function flattenRoutinesByCategory(
	routinesByCategory: Record<string, Routine[]>,
	categories: Category[],
): Routine[] {
	return Object.entries(routinesByCategory).flatMap(([categoryId, routines]) =>
		routines.map((routine, index) => {
			const category = categories.find((category) => category.id === categoryId) || null;

			return {
				...routine,
				category: category,
				order: index,
			};
		}),
	);
}
