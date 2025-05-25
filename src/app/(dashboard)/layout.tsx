'use client';
import { Dashboard } from '@/components/Dashboard';
import { ReactNode, useEffect } from 'react';
import { Routes } from '@/lib/consts';
import { useAuth } from '@/lib/user/auth-context';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { routinesAtomEffect } from '@/lib/routine/routine.hooks';
import { useAtom } from 'jotai/index';
import { categoriesAtomEffect } from '@/lib/category/category.hooks';

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { user, loading } = useAuth();

	useAtom(routinesAtomEffect);
	useAtom(categoriesAtomEffect);

	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			void router.push(Routes.LOGIN);
		}
	}, [loading, router, user]);

	if (loading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<LoaderCircle className="h-10 w-10 animate-spin text-green-500" />
			</div>
		);
	}

	if (!user) {
		return null; // Don't render anything if user is not authenticated
	}

	return <Dashboard>{children}</Dashboard>;
}
