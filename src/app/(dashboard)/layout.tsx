'use client';
import { Dashboard } from '@/components/Dashboard';
import { useEffect } from 'react';
import { Routes } from '@/lib/consts';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user, loading } = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			void router.push(Routes.LOGIN);
		}
	}, [loading, router, user]);

	if (loading) return <div>Loading...</div>;

	if (!user) {
		return null; // Don't render anything if user is not authenticated
	}

	return <Dashboard>{children}</Dashboard>;
}
