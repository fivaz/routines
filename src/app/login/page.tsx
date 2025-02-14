'use client';
import { useEffect, useState } from 'react';
import { parseErrors, validateFields } from './service';
import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signInWithRedirect,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Routes } from '@/lib/consts';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Logo } from '@/components/Logo';
// import { InstallPrompt } from '@/components/InstallPrompt';
import { Button } from '@/components/base/button';
import { Banner } from '@/components/base/banner';
import Link from 'next/link';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const [isDisabled, setIsDisabled] = useState(false);

	const [isLoading, setIsLoading] = useState({
		email: false,
		google: false,
		github: false,
	});

	useEffect(() => {
		if (isLoading.email || isLoading.google || isLoading.github) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [isLoading.email, isLoading.github, isLoading.google]);

	async function handleGoogleProvider() {
		const provider = new GoogleAuthProvider();

		try {
			if (window.innerWidth > 768) {
				await signInWithPopup(auth, provider);
				void router.push(Routes.ROOT);
			} else {
				// Use redirect on mobile
				await signInWithRedirect(auth, provider);
			}
		} catch (error) {
			console.error('Error during Google sign-in:', (error as Error).message);
		}
	}

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading({ ...isLoading, email: true });

		setErrorMessage(validateFields(email, password));
		if (errorMessage) {
			return;
		}

		try {
			await signInWithEmailAndPassword(auth, email, password);
			void router.push(Routes.ROOT);
		} catch (error) {
			setErrorMessage(parseErrors(error));
		} finally {
			setIsLoading({ ...isLoading, email: false });
		}
	}

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Logo className="mx-auto h-10 w-auto text-green-500" />
					<h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
						Sign in to your account
					</h2>
				</div>

				{/*<InstallPrompt />*/}

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<div className="dark:bg-zinc-900 bg-white px-6  shadow-sm sm:rounded-lg sm:px-12">
						<Banner setMessage={setErrorMessage}>{errorMessage}</Banner>
						<div className="py-12">
							<form className="space-y-6" onSubmit={onSubmit}>
								<div>
									<label
										htmlFor="email"
										className="block text-sm/6 font-medium dark:text-white text-gray-900"
									>
										Email address
									</label>
									<div className="mt-2">
										<input
											onChange={(e) => setEmail(e.target.value)}
											id="email"
											name="email"
											type="email"
											required
											autoComplete="email"
											className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="password"
										className="block text-sm/6 font-medium dark:text-white text-gray-900"
									>
										Password
									</label>
									<div className="mt-2">
										<input
											onChange={(e) => setPassword(e.target.value)}
											id="password"
											name="password"
											type="password"
											required
											autoComplete="current-password"
											className="block w-full rounded-md bg-white px-3 py-1.5 text-base  text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex gap-3">
										<div className="flex h-6 shrink-0 items-center">
											<div className="group grid size-4 grid-cols-1">
												<input
													id="remember-me"
													name="remember-me"
													type="checkbox"
													className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-green-600 checked:bg-green-600 indeterminate:border-green-600 indeterminate:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
												/>
												<svg
													fill="none"
													viewBox="0 0 14 14"
													className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
												>
													<path
														d="M3 8L6 11L11 3.5"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
														className="opacity-0 group-has-checked:opacity-100"
													/>
													<path
														d="M3 7H11"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
														className="opacity-0 group-has-indeterminate:opacity-100"
													/>
												</svg>
											</div>
										</div>
										<label
											htmlFor="remember-me"
											className="block text-sm/6 dark:text-white text-gray-900"
										>
											Remember me
										</label>
									</div>

									<div className="text-sm/6">
										<a href="#" className="font-semibold text-green-600 hover:text-green-500">
											Forgot password?
										</a>
									</div>
								</div>

								<div>
									<Button
										isLoading={isLoading.email}
										disabled={isDisabled}
										type="submit"
										color="green"
										className="w-full"
									>
										Sign in
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
						</div>
					</div>
					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Not a member?{' '}
						<Link href="/register" className="font-semibold text-green-600 hover:text-green-500">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
