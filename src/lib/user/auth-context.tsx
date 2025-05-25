'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getRedirectResult, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Routes } from '../consts';
import { useSetAtom } from 'jotai';
import { authLoadingAtom, currentUserAtom } from '@/lib/user/user.type';

const AuthContext = createContext<{
	user: User | null;
	loading: boolean;
}>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

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
			setUser(user);
			setLoading(false);
			setUserAtom(user);
			setLoadingAtom(false);
		});

		return () => unsubscribe();
	}, [router, setUserAtom, setLoadingAtom]);

	return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
