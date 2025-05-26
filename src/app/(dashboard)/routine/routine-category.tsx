import { MouseEvent, PropsWithChildren } from 'react';
import { Subheading } from '@/components/base/heading';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { Category } from '@/lib/category/category.type';
import { GripVerticalIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import clsx from 'clsx';

export function RoutineCategory({
	category,
	index,
	children,
}: PropsWithChildren<{ category: Category; index: number }>) {
	const { isDropTarget, ref } = useSortable({
		id: category.id,
		index,
		type: 'column',
		collisionPriority: CollisionPriority.Low,
		accept: ['item', 'column'],
	});

	const bgClass = isDropTarget ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-950';

	return (
		<div
			className={clsx(
				bgClass,
				'flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800',
			)}
			ref={ref}
		>
			<div className="flex items-center gap-2">
				<Button
					outline
					size="p-2"
					className="cursor-grab touch-none bg-white dark:bg-gray-900"
					onClick={(e: MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation(); // Prevent link click when button is clicked
					}}
				>
					<GripVerticalIcon className="size-4" />
				</Button>

				<Subheading className="text-yellow-600 first-letter:uppercase">{category.name}</Subheading>
			</div>
			<div className="flex min-h-45 flex-col gap-2">{children}</div>
		</div>
	);
}
