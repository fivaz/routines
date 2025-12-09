'use client';
import { Routes } from '@/lib/const';

import { Button } from '@/components/base/button';
import { Banner } from '@/components/base/banner';
import { Input } from '@/components/base/input';
import { Field, Label } from '@/components/base/fieldset';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/auth/firebase';
import { parseErrors, register, validateFields } from '@/app/login/service';
import { minidenticon } from 'minidenticons';
import Image from 'next/image';

export function RegisterForm() {
	const [errorMessage, setErrorMessage] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const [isDisabled, setIsDisabled] = useState(false);

	const [isLoading, setIsLoading] = useState({
		email: false,
		google: false,
	});

	const avatar = useMemo(() => minidenticon(email, 95, 45), [email]);

	const photoURL = useMemo(() => 'data:image/svg+xml;utf8,' + encodeURIComponent(avatar), [avatar]);

	useEffect(() => {
		if (isLoading.email || isLoading.google) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [isLoading.email, isLoading.google]);

	async function handleGoogleProvider() {
		const provider = new GoogleAuthProvider();

		try {
			await signInWithPopup(auth, provider);
			void router.push(Routes.ROOT);
		} catch (error) {
			console.error('Error during Google sign-in:', (error as Error).message);
		}
	}

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setIsLoading((prev) => ({ ...prev, email: true }));

		const validationError = validateFields(email, password);
		setErrorMessage(validationError);

		if (validationError) {
			setIsLoading((prev) => ({ ...prev, email: false }));
			return;
		}

		try {
			await register(name, email, password, avatar);
			void router.push(Routes.LOGIN);
		} catch (error) {
			setErrorMessage(parseErrors(error));
		} finally {
			setIsLoading((prev) => ({ ...prev, email: false }));
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
					{email && (
						<div className="flex flex-col justify-center">
							<h3 className="block text-center text-sm leading-6 font-medium text-gray-900">
								Your Avatar
							</h3>
							<Image
								className="h-10 w-auto"
								width={40}
								height={40}
								alt="your avatar"
								src={photoURL}
							/>
						</div>
					)}
					<Field>
						<Label>Name</Label>
						<Input name="name" required onChange={(e) => setName(e.target.value)} />
					</Field>

					<Field>
						<Label>Email address</Label>
						<Input name="email" type="email" required onChange={(e) => setEmail(e.target.value)} />
					</Field>

					<Field>
						<Label>Password</Label>
						<Input
							name="password"
							type="password"
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Field>

					<div>
						<Button isLoading={isLoading.email} type="submit" color="green" className="w-full">
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

					<Button
						outline
						type="button"
						isLoading={isLoading.google}
						className="flex w-full items-center justify-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
					>
						<GoogleIcon />
						<span className="text-sm/6 font-semibold">Google</span>
					</Button>
				</div>
			</div>
		</form>
	);
}
