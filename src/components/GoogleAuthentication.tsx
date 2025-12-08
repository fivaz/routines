import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Button } from '@/components/base/button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authServer } from '@/app/(auth)/auth.service';

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
			const credential = await signInWithPopup(auth, provider);

			await authServer(credential);
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
