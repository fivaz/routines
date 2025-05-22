import { PropsWithChildren } from 'react';
import { Subheading } from '@/components/base/heading';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';
import { Category } from '@/lib/category/category.type';

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

	const style = isDropTarget ? { background: '#00000030' } : undefined;

	return (
		<div className="p-4 border border-gray-200 rounded-lg" style={style} ref={ref}>
			<Subheading className="mb-3 text-yellow-600 first-letter:uppercase">
				{category.name}
			</Subheading>
			<div className="flex flex-col gap-2 min-h-45">{children}</div>
		</div>
	);
}
