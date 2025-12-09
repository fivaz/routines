import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Button } from '@/components/base/button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/auth/firebase';
import { loginServer } from '@/lib/auth/utils.actions';
import { Routes } from '@/lib/const';

export function GoogleAuthentication({
	setError,
	setIsLoading,
}: {
	setError: (error: string) => void;
	setIsLoading: (loading: boolean) => void;
}) {
	const provider = new GoogleAuthProvider();

	async function handleGoogleProvider() {
		try {
			setIsLoading(true);
			const result = await signInWithPopup(auth, provider);
			const token = await result.user.getIdToken();

			await loginServer(token);

			window.location.href = Routes.ROOT;
		} catch (error) {
			setError(`Error during Google sign-in: ${(error as Error).message}`);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Button
			outline
			className="flex w-full items-center justify-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
			onClick={handleGoogleProvider}
		>
			<GoogleIcon />
			<span className="text-sm/6 font-semibold">Google</span>
		</Button>
	);
}
