import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';
import { Category } from './category.type';
import { DB_PATH } from '@/lib/const';

function getCategoryPath(userId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.CATEGORIES}`;
}

export function fetchCategories(userId: string, setCategories: (categories: Category[]) => void) {
	const categoriesRef = query(collection(db, getCategoryPath(userId)), orderBy('order'));
	return onSnapshot(categoriesRef, (snapshot) => {
		const categories: Category[] = [];
		snapshot.forEach((doc) => {
			categories.push({ ...doc.data(), id: doc.id } as Category);
		});
		setCategories(categories);
	});
}

export async function addCategory(userId: string, category: Category) {
	const newRef = doc(collection(db, getCategoryPath(userId)));
	await setDoc(newRef, category);
}

export async function editCategory(userId: string, category: Category) {
	const ref = doc(db, getCategoryPath(userId), category.id);
	await setDoc(ref, category);
}

export async function deleteCategory(userId: string, categoryId: string) {
	const ref = doc(db, getCategoryPath(userId), categoryId);
	await deleteDoc(ref);
}

export async function updateCategories(userId: string, categories: Category[]) {
	const batch = writeBatch(db);
	categories.forEach((category, index) => {
		const ref = doc(db, getCategoryPath(userId), category.id);
		const categoryProps: Pick<Category, 'order'> = { order: index };
		batch.update(ref, categoryProps);
	});

	try {
		await batch.commit();
	} catch (error) {
		console.error('Error updating categories:', error);
	}
}
