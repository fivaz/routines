'use client';
import { Dashboard } from '@/components/Dashboard';
import { ReactNode, useEffect } from 'react';
import { Routes } from '@/lib/consts';
import { routinesAtomEffect } from '@/lib/routine/routine.hooks';
import { useAtom, useAtomValue } from 'jotai/index';
import { categoriesAtomEffect } from '@/lib/category/category.hooks';
import { currentUserAtom, loadingAuthAtom } from '@/lib/user/user.type';
import useRouterWithQuery from '@/lib/utils.hook';

export default function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const user = useAtomValue(currentUserAtom);
	const loading = useAtomValue(loadingAuthAtom);

	useAtom(routinesAtomEffect);
	useAtom(categoriesAtomEffect);

	const router = useRouterWithQuery();

	useEffect(() => {
		if (!loading && !user) {
			void router.push(Routes.LOGIN);
		}
	}, [router, user, loading]);

	return <Dashboard>{children}</Dashboard>;
}
