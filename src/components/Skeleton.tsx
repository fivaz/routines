import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={clsx('h-2.5 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700', className, {
				'w-32': !className,
			})}
		></div>
	);
}
