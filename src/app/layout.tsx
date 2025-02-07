// app/layout.jsx
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import { type ReactNode } from 'react';
import { PromptProvider } from '@/lib/prompt-context';
import Head from 'next/head';
import { APP_NAME } from '@/lib/consts';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: APP_NAME,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="h-full bg-white lg:bg-zinc-100 dark:bg-zinc-900">
			<body className="h-full">
				<PromptProvider>
					<AuthProvider>{children}</AuthProvider>
				</PromptProvider>
			</body>
		</html>
	);
}
