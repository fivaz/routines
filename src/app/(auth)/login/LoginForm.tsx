'use client';

import { Button } from '@/components/base/button';
import { Banner } from '@/components/base/banner';
import { Input } from '@/components/base/input';
import { Field, Label } from '@/components/base/fieldset';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { parseErrors, validateFields } from '@/app/(auth)/login/service';
import { GoogleAuthentication } from '@/components/GoogleAuthentication';
import { authServer } from '@/app/(auth)/auth.service';

export function LoginForm() {
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const [isEmailLoading, setIsEmailLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsEmailLoading(true);

		const formData = new FormData(event.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		setErrorMessage(validateFields(email, password));
		if (errorMessage) {
			return;
		}

		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);

			await authServer(credential);
		} catch (error) {
			setErrorMessage(parseErrors(error));
		} finally {
			setIsEmailLoading(false);
		}
	}

	return (
		<form
			onSubmit={onSubmit}
			className="bg-white px-6 shadow-sm sm:rounded-lg sm:px-12 dark:bg-zinc-900"
		>
			<Banner setMessage={setErrorMessage}>{errorMessage}</Banner>
			<div className="py-12">
				<div className="space-y-6">
					<Field>
						<Label>Email address</Label>
						<Input name="email" type="email" required autoComplete="email" />
					</Field>

					<Field>
						<Label>Password</Label>
						<Input name="password" type="password" required autoComplete="current-password" />
					</Field>

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
								className="block text-sm/6 text-gray-900 dark:text-white"
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
						<Button type="submit" color="green" className="w-full" isLoading={isEmailLoading}>
							Sign in
						</Button>
					</div>
				</div>

				<div>
					<div className="relative my-6">
						<div aria-hidden="true" className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200" />
						</div>
						<div className="relative flex justify-center text-sm/6 font-medium">
							<span className="bg-gray-100 px-6 text-gray-800 dark:bg-gray-950 dark:text-white">
								Or continue with
							</span>
						</div>
					</div>
					<GoogleAuthentication setError={setErrorMessage} setIsLoading={setIsGoogleLoading} />
				</div>
			</div>
		</form>
	);
}
