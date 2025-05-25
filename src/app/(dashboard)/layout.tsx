'use client';
import { Dashboard } from '@/components/Dashboard';
import { ReactNode, useEffect } from 'react';
import { Routes } from '@/lib/consts';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { routinesAtomEffect } from '@/lib/routine/routine.hooks';
import { useAtom, useAtomValue } from 'jotai/index';
import { categoriesAtomEffect } from '@/lib/category/category.hooks';
import { authLoadingAtom, currentUserAtom } from '@/lib/user/user.type';

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const user = useAtomValue(currentUserAtom);
	const authLoading = useAtomValue(authLoadingAtom);

	useAtom(routinesAtomEffect);
	useAtom(categoriesAtomEffect);

	const router = useRouter();

	useEffect(() => {
		if (!authLoading && !user) {
			void router.push(Routes.LOGIN);
		}
	}, [authLoading, router, user]);

	if (authLoading) {
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
