'use client';

import { useState } from 'react';
import { ArchiveIcon, PlusIcon } from 'lucide-react';
import { useCategories } from '@/lib/category/category.context';
import { type Category, emptyCategory } from '@/lib/category/category.type';
import { Heading } from '@/components/base/heading';
import { Button } from '@/components/base/button';
import { CategoryForm } from '@/app/(dashboard)/categories/category-form';
import { CategoryRow } from '@/app/(dashboard)/categories/category-row';

export default function CategoryPage() {
	const { categories } = useCategories();
	const [categoryForm, setCategoryForm] = useState<Category | null>(null);

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

			{categories.length === 0 && (
				<div className="md:pt-28 pt-32 flex justify-center items-center flex-col">
					<ArchiveIcon className="size-12 text-gray-400" />
					<h2 className="mt-2 text-base font-semibold dark:text-white text-gray-900">
						Add categories
					</h2>
					<p className="mt-1 text-sm text-gray-500">You haven’t added any category yet.</p>
					<Button onClick={handleAddCategory} color="green" className="mt-2">
						<PlusIcon className="size-5" />
						Add Category
					</Button>
				</div>
			)}

			<ul className="grid gap-2">
				{categories.map((category, index) => (
					<CategoryRow
						index={index}
						category={category}
						key={category.id}
						setCategoryForm={setCategoryForm}
					/>
				))}
			</ul>

			<CategoryForm categoryIn={categoryForm} setCategoryIn={setCategoryForm} />
		</div>
	);
}
