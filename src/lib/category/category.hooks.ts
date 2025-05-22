import { useCategories } from './category.context';
import { useAuth } from '@/lib/user/auth-context';
import {
	addCategory as addCategoryRepo,
	deleteCategory as deleteCategoryRepo,
	editCategory as editCategoryRepo,
} from './category.repository';
import { Category } from './category.type';
import { safeThrowUnauthorized } from '@/lib/error-handle';

export function useCategory(categoryId: string) {
	const { categories } = useCategories();
	return categories.find((cat) => cat.id === categoryId);
}

export function useCategoryActions() {
	const { user } = useAuth();

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

	return { addCategory, editCategory, deleteCategory };
}
