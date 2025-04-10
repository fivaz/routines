import { RoutineTime } from '@/lib/routine/routine.type';
import { PropsWithChildren } from 'react';
import { Subheading } from '@/components/base/heading';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';

export function RoutineTimeList({ time, children }: PropsWithChildren<{ time: RoutineTime }>) {
	const { isDropTarget, ref } = useDroppable({
		id: time,
		type: 'column',
		accept: 'item',
		collisionPriority: CollisionPriority.Low,
	});

	const style = isDropTarget ? { background: '#00000030' } : undefined;

	return (
		<div className="p-4 border border-gray-200 rounded-lg" style={style} ref={ref}>
			<Subheading className="mb-3 text-yellow-600 first-letter:uppercase">{time}</Subheading>
			<div className="flex flex-col gap-2 min-h-45">{children}</div>
		</div>
	);
}
