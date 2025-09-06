'use client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import useRouterWithQuery from '@/lib/utils.hook';
import { auth } from '@/lib/firebase';
import { PropsWithChildren } from 'react';
import { Button } from '@/components/base/button';

export default function LogoutButton({ children }: PropsWithChildren) {
	const router = useRouterWithQuery();

	async function handleLogout() {
		await signOut(auth);

		await fetch('/api/logout');

		router.push('/login');
	}

	return <Button onClick={handleLogout}>{children}</Button>;
}
