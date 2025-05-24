import { AuthProvider } from '@/lib/user/auth-context';
import './globals.css';
import { type ReactNode } from 'react';
import { PromptProvider } from '@/lib/prompt-context';
import { APP_NAME } from '@/lib/consts';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: APP_NAME,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="h-full bg-white dark:bg-zinc-900">
			<body className="h-full">
				<PromptProvider>
					<AuthProvider>{children}</AuthProvider>
				</PromptProvider>
			</body>
		</html>
	);
}
