import { XIcon } from 'lucide-react';
import { Dispatch, PropsWithChildren, SetStateAction } from 'react';

export function Banner({
	children,
	setMessage,
}: PropsWithChildren<{
	setMessage: Dispatch<SetStateAction<string>>;
}>) {
	return (
		children && (
			<div className="rounded-md bg-red-50 p-4">
				<div className="flex">
					<button className="shrink-0" onClick={() => setMessage('')}>
						<XIcon aria-hidden="true" className="size-5 text-red-400" />
					</button>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-red-800">{children}</h3>
					</div>
				</div>
			</div>
		)
	);
}
