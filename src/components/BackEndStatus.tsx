import { useBackendStatus } from '@/lib/use-backend-status';
import clsx from 'clsx';
import { Tooltip } from '@/components/base/tooltip';

export function BackEndStatus({}) {
	const { status } = useBackendStatus();

	const statusHash = {
		loading: {
			color: 'fill-blue-500',
			label: 'loading server',
			message: 'The server is currently loading, please wait a moment.',
		},
		error: {
			color: 'fill-red-500',
			label: 'server is off',
			message: 'The server encountered an error and is unavailable.',
		},
		success: {
			color: 'fill-green-500',
			label: 'server is on',
			message: 'The server is up and running smoothly.',
		},
		'no-balance': {
			color: 'fill-yellow-500',
			label: 'no balance',
			message: "You don't credits to create more images",
		},
	};

	// Get the current status details, defaulting to a fallback if status is undefined
	const currentStatus = statusHash[status] || {
		color: 'fill-gray-500',
		label: 'unknown',
		message: 'Server status is unknown.',
	};

	return (
		<Tooltip text={currentStatus.message}>
			<span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-gray-200 ring-inset dark:text-white dark:ring-gray-800">
				<svg viewBox="0 0 6 6" aria-hidden="true" className={clsx('size-1.5', currentStatus.color)}>
					<circle r={3} cx={3} cy={3} />
				</svg>
				{currentStatus.label}
			</span>
		</Tooltip>
	);
}
