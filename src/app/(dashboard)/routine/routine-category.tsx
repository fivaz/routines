import { MouseEvent, PropsWithChildren } from 'react';
import { Subheading } from '@/components/base/heading';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { Category } from '@/lib/category/category.type';
import { GripVerticalIcon } from 'lucide-react';
import { Button } from '@/components/base/button';

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

	const style = isDropTarget ? { background: 'oklch(96.7% 0.003 264.542)' } : undefined;

	return (
		<div
			className="flex gap-2 flex-col p-4 border bg-gray-50 border-gray-200 rounded-lg"
			style={style}
			ref={ref}
		>
			<div className="flex gap-2 items-center">
				<Button
					outline
					className="touch-none cursor-grab bg-white p-1"
					onClick={(e: MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation(); // Prevent link click when button is clicked
					}}
				>
					<GripVerticalIcon className="size-4" />
				</Button>

				<Subheading className="text-yellow-600 first-letter:uppercase">{category.name}</Subheading>
			</div>
			<div className="flex flex-col gap-2 min-h-45">{children}</div>
		</div>
	);
}
