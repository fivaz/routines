import { Routes } from '@/lib/consts';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { ThemeToggle3 } from '@/components/shared/ThemeToggle2';
import { LoginForm } from '@/app/login2/LoginForm';
import { redirect } from 'next/navigation';
import { getUserTokens } from '@/lib/config';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { RegisterForm } from '@/app/register2/RegisterForm';

interface LoginPageProps {}

export default async function Login({}: LoginPageProps) {
	const tokens = await getUserTokens(await cookies());

	if (tokens) {
		redirect('/');
	}

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="absolute top-6 right-6">
					<ThemeToggle3 />
				</div>
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Logo className="mx-auto h-10 w-auto text-green-500" />
					<h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<RegisterForm />
					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Do you an account already?{' '}
						<Link href={Routes.LOGIN} className="font-semibold text-green-600 hover:text-green-500">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
