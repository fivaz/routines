import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Category } from './category.type';
import { fetchCategories, updateCategories } from './category.repository';
import { useAuth } from '@/lib/user/auth-context';
import { safeThrowUnauthorized } from '@/lib/error-handle';

const CategoryContext = createContext<{
	categories: Category[];
	handleCategorySort: (categories: Category[]) => void;
}>({
	categories: [],
	handleCategorySort: () => {},
});

export function CategoryProvider({ children }: PropsWithChildren) {
	const { user } = useAuth();
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		if (!user?.uid) return;

		const unsubscribe = fetchCategories(user.uid, (cats) => {
			setCategories(cats);
		});

		return () => unsubscribe();
	}, [user]);

	function handleCategorySort(categories: Category[]) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		void updateCategories(user.uid, categories);
	}

	return (
		<CategoryContext.Provider value={{ categories, handleCategorySort }}>
			{children}
		</CategoryContext.Provider>
	);
}

export const useCategories = () => useContext(CategoryContext);
