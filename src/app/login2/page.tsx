import { auth } from '@/lib/firebase';
import { Routes } from '@/lib/consts';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Logo } from '@/components/Logo';
// import { InstallPrompt } from '@/components/InstallPrompt';
import { Button } from '@/components/base/button';
import { Banner } from '@/components/base/banner';
import Link from 'next/link';
import { ThemeToggle3 } from '@/components/shared/ThemeToggle2';
import useRouterWithQuery from '@/lib/utils.hook';
import { Input } from '@/components/base/input';
import { Field, Label } from '@/components/base/fieldset';

export default function Login() {
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

				{/*<InstallPrompt />*/}

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<div className="bg-white px-6 shadow-sm sm:rounded-lg sm:px-12 dark:bg-zinc-900">
						{/*<Banner setMessage={setErrorMessage}>{errorMessage}</Banner>*/}
						<div className="py-12">
							<form className="space-y-6">
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
									<Button type="submit" color="green" className="w-full">
										Sign in
									</Button>
								</div>
							</form>

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
									className="flex w-full items-center justify-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
								>
									<GoogleIcon />
									<span className="text-sm/6 font-semibold">Google</span>
								</Button>
							</div>
						</div>
					</div>
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
