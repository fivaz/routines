'use client';

import { useState } from 'react';
import { ArchiveIcon, PlusIcon } from 'lucide-react';
import { categoriesAtom, type Category, emptyCategory } from '@/lib/category/category.type';
import { Heading } from '@/components/base/heading';
import { Button } from '@/components/base/button';
import { CategoryForm } from '@/app/(dashboard)/categories/category-form';
import { CategoryRow } from '@/app/(dashboard)/categories/category-row';
import { useAtomValue } from 'jotai/index';

export default function CategoryPage() {
	const categories = useAtomValue(categoriesAtom);
	const [categoryForm, setCategoryForm] = useState<Category | null>(null);

	function handleAddCategory() {
		setCategoryForm({ ...emptyCategory, createdAt: new Date().toISOString() });
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center justify-between">
				<Heading>Categories</Heading>
				<Button color="green" onClick={handleAddCategory}>
					<PlusIcon className="size-5" />
					New
				</Button>
			</div>

			{categories.length === 0 && (
				<div className="flex flex-col items-center justify-center pt-32 md:pt-28">
					<ArchiveIcon className="size-12 text-gray-400" />
					<h2 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
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
