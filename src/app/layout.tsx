import './globals.css';
import { type ReactNode } from 'react';
import { PromptProvider } from '@/lib/prompt-context';
import { APP_NAME } from '@/lib/const';
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

import localFont from 'next/font/local';
import clsx from 'clsx';

const inter = localFont({
	src: [
		{ path: './fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
		{ path: './fonts/Inter-MediumItalic.woff2', weight: '500', style: 'italic' },
		{ path: './fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
		{ path: './fonts/Inter-SemiBoldItalic.woff2', weight: '600', style: 'italic' },
	],
	variable: '--font-inter',
});

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={clsx('h-full bg-white dark:bg-zinc-900', inter.className)}
			suppressHydrationWarning
		>
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
