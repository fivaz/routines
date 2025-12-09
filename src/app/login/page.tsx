import { Routes } from '@/lib/const';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { LoginForm } from '@/app/login/LoginForm';

export default async function Login() {
	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="absolute top-6 right-6">
					<ThemeToggle />
				</div>
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Logo className="mx-auto h-10 w-auto text-green-500" />
					<h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<LoginForm />
					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Not a member?{' '}
						<Link
							href={Routes.REGISTER}
							className="font-semibold text-green-600 hover:text-green-500"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
