'use client';
import { Dashboard } from '@/components/Dashboard';
import { useEffect } from 'react';
import { Routes } from '@/lib/consts';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

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

	if (loading) {
		return (
			<div className="h-full w-full flex justify-center items-center">
				<LoaderCircle className="animate-spin text-green-500 w-10 h-10" />
			</div>
		);
	}

	if (!user) {
		return null; // Don't render anything if user is not authenticated
	}

	return <Dashboard>{children}</Dashboard>;
}
