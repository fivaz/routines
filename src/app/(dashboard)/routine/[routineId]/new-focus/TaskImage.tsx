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
			<div className="flex justify-center items-center">
				<div className="animate-pulse flex items-center justify-center size-72 md:size-[550px] bg-gray-300 rounded-sm dark:bg-gray-700">
					<ImageIcon className="size-12 text-gray-200 dark:text-gray-600" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex overflow-hidden aspect-square items-center justify-center">
			{task.image ? (
				<Image
					src={task.image}
					alt={task.name}
					width={1024}
					height={1024}
					priority={true}
					sizes="(max-width: 768px) 400px, 1024px"
					className="size-full object-cover rounded-lg"
				/>
			) : (
				<div className="text-4xl text-white flex justify-center items-center rounded-lg size-72 md:size-[550px] bg-linear-to-r/shorter from-indigo-500 to-teal-400">
					{taskIndex + 1}
				</div>
			)}
		</div>
	);
}
