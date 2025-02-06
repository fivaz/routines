import { FirebaseError } from 'firebase/app';

export function checkEmail(email: string): boolean {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function validateFields(email: string, password: string): string {
	if (!email) {
		return 'Email is required';
	}
	if (!checkEmail(email)) {
		return 'Invalid email address';
	}
	if (!password) {
		return 'Password is required';
	}

	return '';
}

export function parseErrors(error: unknown) {
	if (error instanceof FirebaseError) {
		if (error.code === 'auth/invalid-credential') {
			return 'login or password are incorrect';
		} else if (error.code === 'auth/network-request-failed') {
			return "you can't login if you're not connected to the internet";
		} else if (error.code === 'auth/popup-closed-by-user') {
			return 'the pop up was closed, try again';
		} else {
			console.error(error.message);
			return error.message;
		}
	} else {
		console.error(error);
		return 'Unexpected error';
	}
}
