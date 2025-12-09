'use client';
import { Dashboard } from '@/components/Dashboard';
import { ReactNode, useEffect } from 'react';
import { Routes } from '@/lib/const';
import { routinesAtomEffect } from '@/lib/routine/routine.hooks';
import { useAtom, useAtomValue } from 'jotai/index';
import { categoriesAtomEffect } from '@/lib/category/category.hooks';
import { currentUserAtom, loadingAuthAtom } from '@/lib/auth/user.type';
import { useRouter } from 'next/navigation';

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const user = useAtomValue(currentUserAtom);
	const loading = useAtomValue(loadingAuthAtom);

	useAtom(routinesAtomEffect);
	useAtom(categoriesAtomEffect);

	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			void router.push(Routes.LOGIN);
		}
	}, [router, user, loading]);

	return <Dashboard>{children}</Dashboard>;
}
