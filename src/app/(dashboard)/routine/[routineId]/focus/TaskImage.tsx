import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { useAtom } from 'jotai';
import {
	currentTaskAtom,
	taskIndexAtom,
} from '@/app/(dashboard)/routine/[routineId]/new-focus/service';

export function TaskImage() {
	const [task] = useAtom(currentTaskAtom);
	const [taskIndex] = useAtom(taskIndexAtom);

	if (!task) {
		return (
			<div className="flex items-center justify-center">
				<div className="flex size-72 animate-pulse items-center justify-center rounded-sm bg-gray-300 md:size-[550px] dark:bg-gray-700">
					<ImageIcon className="size-12 text-gray-200 dark:text-gray-600" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex aspect-square items-center justify-center self-center overflow-hidden">
			{task.image ? (
				<Image
					src={task.image}
					alt={task.name}
					width={1024}
					height={1024}
					priority={true}
					sizes="(max-width: 768px) 400px, 1024px"
					className="size-full rounded-lg object-cover"
				/>
			) : (
				<div className="flex size-72 items-center justify-center rounded-lg bg-linear-to-r/shorter from-indigo-500 to-teal-400 text-4xl text-white md:size-[550px]">
					{taskIndex + 1}
				</div>
			)}
		</div>
	);
}
