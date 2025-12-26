import { Button } from '@/components/base/button';
import { Category } from '@/lib/category/category.type';
import { GripVerticalIcon, PencilIcon, Trash2 } from 'lucide-react';
import { usePrompt } from '@/lib/prompt-context';
import { useCategoryActions } from '@/lib/category/category.hooks';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { CollisionPriority } from '@dnd-kit/abstract';

export function CategoryRow({
	category,
	setCategoryForm,
	index,
}: {
	index: number;
	category: Category;
	setCategoryForm: Dispatch<SetStateAction<Category | null>>;
}) {
	const { deleteCategory } = useCategoryActions();
	const { createPrompt } = usePrompt();

	const { isDropTarget, ref } = useSortable({
		id: category.id,
		index,
		collisionPriority: CollisionPriority.Low,
	});

	const style = isDropTarget ? { background: 'oklch(79.2% 0.209 151.711)' } : undefined;

	async function handleDelete(category: Category) {
		const confirm = await createPrompt({
			title: 'Delete Category',
			message: `Are you sure you want to delete category "${category.name}"?`,
		});

		if (confirm) {
			await deleteCategory(category.id);
		}
	}

	return (
		<li
			style={style}
			ref={ref}
			key={category.id}
			className="flex items-center justify-between rounded-md border border-green-100 bg-green-500 p-4 shadow-md dark:border-green-600 dark:bg-green-800"
		>
			<div className="flex items-center gap-2">
				<Button
					outline
					className="cursor-grab touch-none"
					onClick={(e: MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation(); // Prevent link click when button is clicked
					}}
				>
					<GripVerticalIcon className="size-4 text-white" />
				</Button>
				<span className="text-white">{category.name}</span>
			</div>
			<div className="flex gap-2">
				<Button outline onClick={() => setCategoryForm(category)}>
					<PencilIcon className="size-4 text-white" />
				</Button>
				<Button outline onClick={() => handleDelete(category)}>
					<Trash2 className="size-4 text-white" />
				</Button>
			</div>
		</li>
	);
}
