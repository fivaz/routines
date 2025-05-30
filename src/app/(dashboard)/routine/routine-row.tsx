import type { MouseEvent, PropsWithChildren } from 'react';
import type { Routine } from '@/lib/routine/routine.type';

import { Routes } from '@/lib/consts';
import { useSortable } from '@dnd-kit/react/sortable';
import { GripVerticalIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import { ImageWaitingSkeleton } from '@/components/task/ImageWaitingSkeleton';
import { Link } from '@/components/base/link';

export function RoutineRow({
	routine,
	index,
	categoryId,
}: PropsWithChildren<{ routine: Routine; index: number; categoryId: string }>) {
	const { ref, isDragging } = useSortable({
		id: routine.id,
		index,
		type: 'item',
		accept: 'item',
		group: categoryId,
	});

	return (
		<div
			ref={ref}
			data-dragging={isDragging}
			className="group relative flex h-40 flex-col rounded-lg border-green-400 bg-cover bg-center hover:border"
			style={{ backgroundImage: `url('${routine.image}')` }}
		>
			<ImageWaitingSkeleton image={routine.image} />
			<div className="absolute top-4 left-4 z-30">
				<Button
					outline
					size="p-2"
					className="dark cursor-grab touch-none border-gray-700 shadow"
					onClick={(e: MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation(); // Prevent link click when button is clicked
					}}
				>
					<GripVerticalIcon className="size-6" />
				</Button>
			</div>

			<Link
				href={Routes.ROUTINE(routine.id)}
				className="z-20 grid h-full w-full grid-cols-2 grid-rows-2 p-4"
			>
				<div className="col-span-1 col-start-2 row-span-1 row-start-1 justify-self-end p-0.5 text-white group-hover:underline first-letter:uppercase"></div>
				<div className="col-span-1 col-start-1 row-span-1 row-start-2 self-end p-0.5 text-white group-hover:underline first-letter:uppercase">
					{routine.name}
				</div>
				<div className="col-span-1 col-start-2 row-span-1 row-start-2 self-end justify-self-end p-0.5 text-white group-hover:underline first-letter:uppercase"></div>
			</Link>

			<div className="absolute inset-0 rounded-lg bg-black/10 group-hover:bg-black/25"></div>
		</div>
	);
}
