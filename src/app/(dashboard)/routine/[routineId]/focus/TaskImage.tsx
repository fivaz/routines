import { FastForwardIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { useAtomValue } from 'jotai';
import {
	currentTaskAtom,
	taskIndexAtom,
} from '@/app/(dashboard)/routine/[routineId]/focus/service';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function TaskImage() {
	const task = useAtomValue(currentTaskAtom);
	const taskIndex = useAtomValue(taskIndexAtom);
	const searchParams = useSearchParams();

	const containerRef = useRef<HTMLDivElement>(null);
	const [squareSize, setSquareSize] = useState(0);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const resizeObserver = new ResizeObserver(() => {
			const { width, height } = container.getBoundingClientRect();
			setSquareSize(Math.min(width, height));
		});

		resizeObserver.observe(container);

		// Initial measurement
		const { width, height } = container.getBoundingClientRect();
		setSquareSize(Math.min(width, height));

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	let content;

	if (!task) {
		content = (
			<div className="flex size-full animate-pulse items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700">
				<ImageIcon className="size-12 text-gray-200 dark:text-gray-600" />
			</div>
		);
	} else if (task.image) {
		content = (
			<Image
				src={task.image}
				alt={task.name}
				width={1024}
				height={1024}
				className="size-full rounded-lg object-cover"
			/>
		);
	} else {
		content = (
			<div className="flex size-full items-center justify-center text-4xl text-white">
				{taskIndex + 1}
			</div>
		);
	}

	return (
		<div ref={containerRef} className="flex size-full items-center justify-center overflow-hidden">
			<div
				style={{ width: squareSize, height: squareSize }}
				className="relative rounded-lg bg-linear-to-r/shorter from-indigo-500 to-teal-400 text-4xl"
			>
				{searchParams.has('recording') && (
					<FastForwardIcon className="absolute top-2 left-3 z-50 size-10 text-green-200" />
				)}
				{content}
			</div>
		</div>
	);
}
