import {
	addCategory as addCategoryRepo,
	deleteCategory as deleteCategoryRepo,
	editCategory as editCategoryRepo,
	fetchCategories,
	updateCategories as updateCategoriesRepo,
} from './category.repository';
import { categoriesAtom, Category } from './category.type';
import { safeThrowUnauthorized } from '@/lib/error-handle';
import { atomEffect } from 'jotai-effect';
import { currentUserAtom } from '@/lib/user/user.type';
import { useAtomValue } from 'jotai/index';

export const categoriesAtomEffect = atomEffect((get, set) => {
	const user = get(currentUserAtom);

	if (!user?.uid) {
		set(categoriesAtom, []);
		return;
	}

	const unsubscribe = fetchCategories(user.uid, (categories) => set(categoriesAtom, categories));

	return () => unsubscribe();
});

export function useCategoryActions() {
	const user = useAtomValue(currentUserAtom);

	async function addCategory(category: Category) {
		if (!user?.uid) return safeThrowUnauthorized();
		return addCategoryRepo(user.uid, category);
	}

	async function editCategory(category: Category) {
		if (!user?.uid) return safeThrowUnauthorized();
		return editCategoryRepo(user.uid, category);
	}

	async function deleteCategory(categoryId: string) {
		if (!user?.uid) return safeThrowUnauthorized();
		return deleteCategoryRepo(user.uid, categoryId);
	}

	async function updateCategories(routines: Category[]) {
		if (!user?.uid) return safeThrowUnauthorized();
		return updateCategoriesRepo(user.uid, routines);
	}

	return { addCategory, editCategory, deleteCategory, updateCategories };
}
