import { PropsWithChildren } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { Routes } from '@/lib/consts';
import Link from 'next/link';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';
import { Button } from '@/components/base/button';

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
			className="relative bg-green-500 p-4 h-40 flex flex-col bg-cover bg-center rounded-lg"
			style={{ backgroundImage: `url('${routine.image}')`, ...style }}
		>
			<div className="flex">
				<Button outline {...listeners} className="z-10 dark">
					<GripVerticalIcon />
				</Button>
				<Link className="h-full w-full  z-10" href={`${Routes.ROUTINE}/${routine.id}`}></Link>
			</div>

			<Link href={`${Routes.ROUTINE}/${routine.id}`} className="h-full w-full items-end flex z-10">
				<div className="text-white p-0.5 text-lg self-end">{routine.name}</div>
			</Link>

			<div className="absolute inset-0 bg-black/25 rounded-lg"></div>
		</div>
	);
}
