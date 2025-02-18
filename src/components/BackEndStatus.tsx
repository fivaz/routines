import useBackendStatus from '@/lib/use-backend-status';
import clsx from 'clsx';

export function BackEndStatus({}) {
	const { status } = useBackendStatus();

	const statusColor = {
		loading: 'fill-blue-500',
		fail: 'fill-red-500',
		success: 'fill-green-500',
	} as const;

	return (
		<span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium dark:text-white text-gray-900 ring-1 dark:ring-gray-800 ring-gray-200 ring-inset">
			<svg viewBox="0 0 6 6" aria-hidden="true" className={clsx('size-1.5', statusColor[status])}>
				<circle r={3} cx={3} cy={3} />
			</svg>
			{status === 'loading' && 'loading server'}
			{status === 'success' && 'server is running'}
			{status === 'fail' && 'server is down'}
		</span>
	);
}
