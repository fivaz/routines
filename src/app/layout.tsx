import './globals.css';
import { type ReactNode } from 'react';
import { PromptProvider } from '@/lib/prompt-context';
import { APP_NAME } from '@/lib/consts';
import { Metadata, Viewport } from 'next';
import { AuthController } from '@/app/AuthController';
import { Provider } from 'jotai';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
	title: APP_NAME,
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="h-full bg-white dark:bg-zinc-900" suppressHydrationWarning>
			<body className="h-full">
				<ThemeProvider attribute="class">
					<Provider>
						<AuthController>
							<PromptProvider>{children}</PromptProvider>
						</AuthController>
					</Provider>
				</ThemeProvider>
			</body>
		</html>
	);
}
