'use client';
import { useSetAtom } from 'jotai/index';
import { authLoadingAtom, currentUserAtom } from '@/lib/user/user.type';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Routes } from '@/lib/consts';

export function AuthController() {
	const setUserAtom = useSetAtom(currentUserAtom);
	const setLoadingAtom = useSetAtom(authLoadingAtom);

	const router = useRouter();

	useEffect(() => {
		getRedirectResult(auth).then((result) => {
			if (result) {
				void router.push(Routes.ROOT);
			}
		});

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUserAtom(user);
			setLoadingAtom(false);
		});

		return () => unsubscribe();
	}, [router, setUserAtom, setLoadingAtom]);

	return <></>;
}
