import { LoaderCircleIcon, TriangleAlertIcon } from 'lucide-react';
import React from 'react';

export function ImageWaitingSkeleton({ image }: { image: string }) {
	if (image === 'waiting_image') {
		return (
			<div className="flex p-4 items-center z-10 justify-end rounded-lg absolute inset-0 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
				<div className="flex gap-2 items-center">
					<LoaderCircleIcon className="text-white animate-spin size-5" />
					<span className="text-white text-sm">an image is being generated...</span>
				</div>
			</div>
		);
	}

	if (image === 'error') {
		return (
			<div
				className="flex p-4 items-center z-10 justify-end rounded-lg absolute inset-0 bg-gradient-to-r from-red-500 from-10% via-orange-500 via-30% to-yellow-500 to-90%
"
			>
				<div className="flex gap-2 items-center">
					<TriangleAlertIcon className="text-white size-5" />
					<span className="text-white text-sm">error on generating image</span>
				</div>
			</div>
		);
	}

	if (image === '') {
		return (
			<div className="flex p-4 items-center z-10 justify-end rounded-lg absolute inset-0 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" />
		);
	}
}
