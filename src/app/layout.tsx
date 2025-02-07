// app/layout.jsx
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import { type ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="h-full bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
			<body className="h-full">
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
