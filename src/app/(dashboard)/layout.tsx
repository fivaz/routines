'use client';
import { Dashboard } from '@/components/Dashboard';
import { ReactNode, useEffect } from 'react';
import { Routes } from '@/lib/consts';
import { useRouter } from 'next/navigation';
import { routinesAtomEffect } from '@/lib/routine/routine.hooks';
import { useAtom, useAtomValue } from 'jotai/index';
import { categoriesAtomEffect } from '@/lib/category/category.hooks';
import { currentUserAtom } from '@/lib/user/user.type';

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const user = useAtomValue(currentUserAtom);

	useAtom(routinesAtomEffect);
	useAtom(categoriesAtomEffect);

	const router = useRouter();

	useEffect(() => {
		if (!user.loading && !user.data) {
			void router.push(Routes.LOGIN);
		}
	}, [router, user.data, user.loading]);

	return <Dashboard>{children}</Dashboard>;
}
