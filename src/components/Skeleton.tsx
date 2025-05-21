import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={clsx('animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-700', className, {
				'w-32': !className,
			})}
		></div>
	);
}
