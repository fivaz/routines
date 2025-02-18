'use client';
import { Logo } from '@/components/Logo';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { GithubIcon } from '@/components/icons/GithubIcon';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Routes } from '@/lib/consts';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { parseErrors, register, validateFields } from '../login/service';
import { minidenticon } from 'minidenticons';
import { Banner } from '@/components/base/banner';
import { Button } from '@/components/base/button';

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const [isLoading, setIsLoading] = useState({
		email: false,
		google: false,
		github: false,
	});

	const avatar = useMemo(() => minidenticon(email, 95, 45), [email]);

	const photoURL = useMemo(() => 'data:image/svg+xml;utf8,' + encodeURIComponent(avatar), [avatar]);

	async function handleGoogleProvider() {
		const provider = new GoogleAuthProvider();

		try {
			await signInWithPopup(auth, provider);
			void router.push(Routes.ROOT);
		} catch (error) {
			console.error('Error during Google sign-in:', (error as Error).message);
		}
	}

	async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrorMessage(validateFields(email, password));
		if (errorMessage) {
			return;
		}

		try {
			setIsLoading((prev) => ({ ...prev, email: true }));
			await register(name, email, password, avatar);
			void router.push(Routes.ROOT);
		} catch (error) {
			setErrorMessage(parseErrors(error));
		} finally {
			setIsLoading((prev) => ({ ...prev, email: false }));
		}
	}

	return (
		<>
			<div className="bg-white dark:bg-gray-600 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<Logo className="mx-auto h-10 w-auto text-green-500" />
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
						Create your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<Banner className="mb-3" setMessage={setErrorMessage}>
						{errorMessage}
					</Banner>

					<form className="space-y-6" onSubmit={handleSubmit}>
						{email && (
							<div className="flex flex-col justify-center">
								<h3 className="block text-center text-sm font-medium leading-6 text-gray-900">
									Your Avatar
								</h3>
								<img className="h-10 w-auto" alt="your avatar" src={photoURL} />
							</div>
						)}
						<div>
							<label
								htmlFor="name"
								className="block text-sm/6 font-medium text-gray-900 dark:text-white"
							>
								Name
							</label>
							<div className="mt-2">
								<input
									id="name"
									name="name"
									type="text"
									required
									onChange={(e) => setName(e.target.value)}
									className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 sm:text-sm/6"
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm/6 font-medium text-gray-900 dark:text-white"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									onChange={(e) => setEmail(e.target.value)}
									required
									autoComplete="email"
									className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm/6 font-medium text-gray-900 dark:text-white"
								>
									Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									onChange={(e) => setPassword(e.target.value)}
									type="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<Button
								isLoading={isLoading.email}
								disabled={isLoading.email}
								type="submit"
								color="green"
								className="w-full"
							>
								Sign up
							</Button>
						</div>
					</form>

					<div>
						<div className="relative mt-10">
							<div aria-hidden="true" className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm/6 font-medium">
								<span className="bg-white px-6 text-gray-900">Or continue with</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-4">
							<a
								onClick={handleGoogleProvider}
								className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
							>
								<GoogleIcon />
								<span className="text-sm/6 font-semibold">Google</span>
							</a>

							<a
								href="#"
								className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
							>
								<GithubIcon />
								<span className="text-sm/6 font-semibold">GitHub</span>
							</a>
						</div>
					</div>

					<p className="mt-10 text-center text-sm/6 text-gray-400">
						Do you an account already?{' '}
						<a href="/login" className="font-semibold text-green-400 hover:text-green-300">
							Sign in
						</a>
					</p>
				</div>
			</div>
		</>
	);
}
