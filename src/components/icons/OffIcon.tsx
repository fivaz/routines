import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function OffIcon({ className, children }: PropsWithChildren<{ className?: string }>) {
	return (
		<div className="relative">
			{children}
			<svg
				className={clsx(className, 'pointer-events-none absolute inset-0 size-full')}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			>
				<path d="M2 2L22 22" />
			</svg>
		</div>
	);
}
