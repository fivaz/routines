import { FirebaseError } from 'firebase/app';

export const parseError = (error: unknown) => {
	if (error instanceof FirebaseError) {
		if (error.code === 'auth/invalid-credential') {
			return 'login or password are incorrect';
		} else if (error.code === 'auth/network-request-failed') {
			return "you can't login if you're not connected to the internet";
		} else if (error.code === 'auth/email-already-in-use') {
			return 'this email is already in use';
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
};
