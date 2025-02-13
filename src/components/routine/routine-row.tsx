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
			className="group hover:border border-green-400 relative bg-sky-400 h-40 flex flex-col bg-cover bg-center rounded-lg"
			style={{ backgroundImage: `url('${routine.image}')`, ...style }}
		>
			<div className="z-20 absolute top-4 left-4">
				<Button
					{...listeners}
					outline
					className="dark cursor-grab"
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation(); // Prevent link click when button is clicked
						console.log('Button clicked');
					}}
				>
					<GripVerticalIcon className="size-6" />
				</Button>
			</div>

			<Link href={`${Routes.ROUTINE}/${routine.id}`} className="p-4 h-full w-full z-10 flex">
				<div className="text-white p-0.5 text-lg self-end first-letter:uppercase group-hover:underline">
					{routine.name}
				</div>
			</Link>

			<div className="absolute inset-0 group-hover:bg-black/25 bg-black/10  rounded-lg"></div>
		</div>
	);
}
