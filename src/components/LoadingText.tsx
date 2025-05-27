import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function LoadingText({
	loading,
	children,
	className,
}: PropsWithChildren<{ loading: boolean; className?: string }>) {
	if (loading) {
		return (
			<div
				className={clsx(
					'h-2.5 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700',
					className,
					{
						'w-32': !className,
					},
				)}
			></div>
		);
	}
	return children;
}
