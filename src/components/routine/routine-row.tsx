import { PropsWithChildren } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { Button } from '../base/button';
import { Routes } from '@/lib/consts';
import Link from 'next/link';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function RoutineRow({ routine }: PropsWithChildren<{ routine: Routine }>) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: routine.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			className="relative bg-gray-800 text-white p-4 h-40 flex items-end bg-cover bg-center"
			style={{ backgroundImage: `url('${routine.image}')`, ...style }}
		>
			<GripVertical {...listeners}></GripVertical>
			<Link href={`${Routes.ROUTINE}/${routine.id}`}>
				<p className="bg-green-500 bg-opacity-50 p-0.5 text-lg">
					{routine.name}-{routine.id}
				</p>
			</Link>
		</div>
	);
}
