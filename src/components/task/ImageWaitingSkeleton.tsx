import { LoaderCircleIcon, TriangleAlertIcon } from 'lucide-react';
import React from 'react';

export function ImageWaitingSkeleton({ image }: { image: string }) {
	if (image === 'waiting_image') {
		return (
			<div className="absolute inset-0 z-10 flex items-center justify-end rounded-lg bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-4">
				<div className="flex items-center gap-2">
					<LoaderCircleIcon className="size-5 animate-spin text-white" />
					<span className="text-sm text-white">an image is being generated...</span>
				</div>
			</div>
		);
	}

	if (image === 'error') {
		return (
			<div className="absolute inset-0 z-10 flex items-center justify-end rounded-lg bg-gradient-to-r from-red-500 from-10% via-orange-500 via-30% to-yellow-500 to-90% p-4">
				<div className="flex items-center gap-2">
					<TriangleAlertIcon className="size-5 text-white" />
					<span className="text-sm text-white">error on generating image</span>
				</div>
			</div>
		);
	}

	if (image === '') {
		return (
			<div className="absolute inset-0 z-10 flex items-center justify-end rounded-lg bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-4" />
		);
	}
}
