'use client';

import { useState } from 'react';
import { PencilIcon, PlusIcon, Trash2 } from 'lucide-react';
import { useCategories } from '@/lib/category/category.context';
import { useCategoryActions } from '@/lib/category/category.hooks';
import { type Category, emptyCategory } from '@/lib/category/category.type';
import { Heading } from '@/components/base/heading';
import { Button } from '@/components/base/button';
import { usePrompt } from '@/lib/prompt-context';
import { CategoryForm } from '@/app/(dashboard)/categories/category-form';

export default function CategoryPage() {
	const { categories } = useCategories();
	const { deleteCategory } = useCategoryActions();
	const [categoryForm, setCategoryForm] = useState<Category | null>(null);
	const { createPrompt } = usePrompt();

	async function handleDelete(category: Category) {
		const confirm = await createPrompt({
			title: 'Delete Category',
			message: `Are you sure you want to delete category "${category.name}"?`,
		});

		if (confirm) {
			await deleteCategory(category.id);
		}
	}

	function handleAddCategory() {
		setCategoryForm({ ...emptyCategory, createdAt: new Date().toISOString() });
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex justify-between items-center">
				<Heading>Categories</Heading>
				<Button color="green" onClick={handleAddCategory}>
					<PlusIcon className="size-5" />
					New
				</Button>
			</div>

			<ul className="grid gap-2">
				{categories.map((category) => (
					<li
						key={category.id}
						className="p-4 border border-green-100 dark:border-green-600 rounded-md flex justify-between items-center bg-green-500 dark:bg-green-800"
					>
						<span className="text-white">{category.name}</span>
						<div className="flex gap-2">
							<Button outline onClick={() => setCategoryForm(category)}>
								<PencilIcon className="size-5 text-white" />
							</Button>
							<Button outline onClick={() => handleDelete(category)}>
								<Trash2 className="size-5 text-white" />
							</Button>
						</div>
					</li>
				))}
			</ul>

			<CategoryForm categoryIn={categoryForm} setCategoryIn={setCategoryForm} />
		</div>
	);
}
