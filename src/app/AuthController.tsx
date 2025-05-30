'use client';
import { useSetAtom } from 'jotai';
import { currentUserAtom, loadingAuthAtom } from '@/lib/user/user.type';
import { PropsWithChildren, useEffect } from 'react';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Routes } from '@/lib/consts';
import useRouterWithQuery from '@/lib/utils.hook';

type AuthControllerProps = PropsWithChildren;

export function AuthController({ children }: AuthControllerProps) {
	const setUser = useSetAtom(currentUserAtom);
	const setLoading = useSetAtom(loadingAuthAtom);

	const router = useRouterWithQuery();

	useEffect(() => {
		setLoading(true);
		getRedirectResult(auth).then((result) => {
			if (result) {
				void router.push(Routes.ROOT);
			}
		});

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [router, setLoading, setUser]);

	return <>{children}</>;
}
