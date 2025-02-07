import { PropsWithChildren } from 'react';
import { Routine } from '@/lib/routine/routine.type';
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
		<Link href={`${Routes.ROUTINE}/${routine.id}`}>
			<div
				ref={setNodeRef}
				{...attributes}
				className="relative bg-green-500 p-4 h-40 flex items-end bg-cover bg-center rounded-lg"
				style={{ backgroundImage: `url('${routine.image}')`, ...style }}
			>
				<div className="flex gap-2 items-center z-10">
					<GripVertical
						className="text-white"
						onClick={(e) => e.stopPropagation()}
						{...listeners}
					/>

					<p className="text-white p-0.5 text-lg">{routine.name}</p>
				</div>

				<div className="absolute inset-0 bg-black/25 rounded-lg"></div>
			</div>
		</Link>
	);
}
