import React, { PropsWithChildren, useRef, useState } from 'react';
import {
	arrow,
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	Placement,
	shift,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
} from '@floating-ui/react';

interface TooltipProps {
	text: string;
	placement?: Placement;
	delay?: number;
	className?: string;
}

export function Tooltip({
	children,
	text,
	placement = 'top',
	delay = 200,
	className = '',
}: PropsWithChildren<TooltipProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const arrowRef = useRef(null);

	const { x, y, strategy, refs, context, middlewareData } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement,
		middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
		whileElementsMounted: autoUpdate,
	});

	const hover = useHover(context, { move: false, delay: { open: delay } });
	const focus = useFocus(context);
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: 'tooltip' });

	const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

	// Arrow positioning
	const { x: arrowX, y: arrowY } = middlewareData.arrow || { x: 0, y: 0 };
	const staticSide = {
		top: 'bottom',
		right: 'left',
		bottom: 'top',
		left: 'right',
	}[placement.split('-')[0]] as string;

	return (
		<>
			<div ref={refs.setReference} {...getReferenceProps()}>
				{children}
			</div>
			{isOpen && (
				<FloatingPortal>
					<div
						ref={refs.setFloating}
						style={{
							position: strategy,
							top: y ?? 0,
							left: x ?? 0,
							zIndex: 50,
						}}
						{...getFloatingProps()}
						className={`max-w-xs rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg ${className}`}
					>
						<div
							ref={arrowRef}
							className="absolute h-2 w-2 rotate-45 bg-gray-900"
							style={{
								left: arrowX != null ? `${arrowX}px` : '',
								top: arrowY != null ? `${arrowY}px` : '',
								[staticSide]: '-4px',
							}}
						/>
						{text}
					</div>
				</FloatingPortal>
			)}
		</>
	);
}
