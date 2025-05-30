'use client';
import { useSetAtom } from 'jotai/index';
import { currentUserAtom } from '@/lib/user/user.type';
import { PropsWithChildren, useEffect } from 'react';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Routes } from '@/lib/consts';
import useRouterWithQuery from '@/lib/utils.hook';

type AuthControllerProps = PropsWithChildren;

export function AuthController({ children }: AuthControllerProps) {
	const setUserAtom = useSetAtom(currentUserAtom);

	const router = useRouterWithQuery();

	useEffect(() => {
		setUserAtom({ data: null, loading: true });
		getRedirectResult(auth).then((result) => {
			if (result) {
				void router.push(Routes.ROOT);
			}
		});

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUserAtom({ data: user, loading: false });
		});

		return () => unsubscribe();
	}, [router, setUserAtom]);

	return <>{children}</>;
}
