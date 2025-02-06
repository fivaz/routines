'use client';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Dashboard } from '@/components/Dashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { Routes } from '@/lib/consts';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user, loading } = useAuth();

	const router = useRouter();

	useEffect(() => {
		// onAuthStateChanged(auth, (user) => {
		// 	setUser(user);
		if (!loading && !user) {
			void router.push(Routes.LOGIN);
		}
		// });
	}, [loading, router, user]);

	if (loading) return <div>Loading...</div>;

	if (!user) {
		return null; // Don't render anything if user is not authenticated
	}

	return <Dashboard>{children}</Dashboard>;
}
