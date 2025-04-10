'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getRedirectResult, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Routes } from '../consts';

const AuthContext = createContext<{
	user: User | null;
	loading: boolean;
}>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		getRedirectResult(auth).then((result) => {
			if (result) {
				// User is signed in
				void router.push(Routes.ROOT);
			}
		});

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [router]);

	return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
