// app/layout.jsx
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import { type ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
