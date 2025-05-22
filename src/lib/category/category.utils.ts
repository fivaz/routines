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
		const categoryId = routine.category?.id ?? UNCATEGORIZED_KEY;
		if (!grouped[categoryId]) {
			grouped[categoryId] = [];
		}
		grouped[categoryId].push(routine);
	}

	return grouped;
}
