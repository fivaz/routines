import { createContext, useContext, useState, ReactNode } from 'react';

import { Prompt } from '@/components/Prompt';

type PromptOptions = {
	title: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
};

type PromptState = PromptOptions & {
	isOpen: boolean;
	resolve?: (value: boolean | null) => void;
};

type PromptContextType = {
	createPrompt: (options: PromptOptions) => Promise<boolean | null>;
	closePrompt: () => void;
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider = ({ children }: { children: ReactNode }) => {
	const [prompt, setPrompt] = useState<PromptState>({
		isOpen: false,
		title: '',
		message: '',
		confirmText: 'Confirm',
		cancelText: 'Cancel',
	});

	const createPrompt = (options: PromptOptions): Promise<boolean | null> => {
		return new Promise((resolve) => {
			setPrompt({
				...options,
				isOpen: true,
				confirmText: options.confirmText || 'Confirm',
				cancelText: options.cancelText || 'Cancel',
				resolve,
			});
		});
	};

	const closePrompt = () => {
		setPrompt((prev) => ({ ...prev, isOpen: false }));
	};

	return (
		<PromptContext.Provider value={{ createPrompt, closePrompt }}>
			{children}
			<Prompt {...prompt} closePrompt={closePrompt} />
		</PromptContext.Provider>
	);
};

export const usePrompt = () => {
	const context = useContext(PromptContext);
	if (!context) {
		throw new Error('usePrompt must be used within a PromptProvider');
	}
	return context;
};
