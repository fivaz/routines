import { PropsWithChildren } from 'react';
import { Routine } from '@/lib/routine/routine.type';

import { Routes } from '@/lib/consts';
import Link from 'next/link';
import { useSortable } from '@dnd-kit/react/sortable';
import { GripVerticalIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import { formatSeconds } from '@/lib/task/task.utils';
import { ImageWaitingSkeleton } from '@/components/task/ImageWaitingSkeleton';

export function RoutineRow({
	routine,
	index,
	group,
}: PropsWithChildren<{ routine: Routine; index: number; group: string }>) {
	const { ref, isDragging } = useSortable({
		id: routine.id,
		index,
		type: 'item',
		accept: 'item',
		group: group,
	});

	return (
		<div
			ref={ref}
			data-dragging={isDragging}
			className="group hover:border border-green-400 relative h-40 flex flex-col bg-cover bg-center rounded-lg"
			style={{ backgroundImage: `url('${routine.image}')` }}
		>
			<ImageWaitingSkeleton image={routine.image} />
			<div className="z-30 absolute top-4 left-4">
				<Button
					outline
					className="touch-none dark cursor-grab"
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation(); // Prevent link click when button is clicked
					}}
				>
					<GripVerticalIcon className="size-6" />
				</Button>
			</div>

			<Link
				href={`${Routes.ROUTINE}/${routine.id}`}
				className="p-4 h-full w-full z-20 grid grid-cols-2 grid-rows-2"
			>
				<div className="justify-self-end col-start-2 col-span-1 row-start-1 row-span-1 text-white p-0.5 first-letter:uppercase group-hover:underline">
					{formatSeconds(routine.totalDuration || 0) || '0 s'}
				</div>
				<div className="self-end col-start-1 col-span-1 row-start-2 row-span-1 text-white p-0.5 first-letter:uppercase group-hover:underline">
					{routine.name}
				</div>
				<div className="self-end justify-self-end col-start-2 col-span-1 row-start-2 row-span-1 text-white p-0.5 first-letter:uppercase group-hover:underline">
					{routine.taskCount || 0} tasks
				</div>
			</Link>

			<div className="absolute inset-0 group-hover:bg-black/25 bg-black/10  rounded-lg"></div>
		</div>
	);
}
