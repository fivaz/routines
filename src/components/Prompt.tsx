import { useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type PromptProps = {
	isOpen: boolean;
	title: string;
	message?: string;
	confirmText: string;
	cancelText: string;
	resolve?: (value: boolean | null) => void;
	closePrompt: () => void;
};

export function Prompt({
	isOpen,
	title,
	message,
	confirmText,
	cancelText,
	resolve,
	closePrompt,
}: PromptProps) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isOpen && e.key === 'Enter') {
				resolve?.(true);
				closePrompt();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, resolve, closePrompt]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl p-6">
				<button
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
					onClick={() => resolve?.(null) || closePrompt()}
				>
					<XMarkIcon className="h-6 w-6" />
				</button>
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
						<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">{title}</h3>
						{message && <p className="text-sm text-gray-500">{message}</p>}
					</div>
				</div>
				<div className="mt-5 flex justify-end gap-3">
					<button
						className="px-4 py-2 bg-gray-200 rounded"
						onClick={() => resolve?.(false) || closePrompt()}
					>
						{cancelText}
					</button>
					<button
						className="px-4 py-2 bg-red-600 text-white rounded"
						onClick={() => resolve?.(true) || closePrompt()}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
