import { PropsWithChildren } from 'react';
import { Subheading } from '@/components/base/heading';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useSortable } from '@dnd-kit/react/sortable';

export function RoutineGroup({
	group,
	index,
	children,
}: PropsWithChildren<{ group: string; index: number }>) {
	const { isDropTarget, ref } = useSortable({
		id: group,
		index,
		type: 'column',
		collisionPriority: CollisionPriority.Low,
		accept: ['item', 'column'],
	});

	const style = isDropTarget ? { background: '#00000030' } : undefined;

	return (
		<div className="p-4 border border-gray-200 rounded-lg" style={style} ref={ref}>
			<Subheading className="mb-3 text-yellow-600 first-letter:uppercase">{group}</Subheading>
			<div className="flex flex-col gap-2 min-h-45">{children}</div>
		</div>
	);
}
