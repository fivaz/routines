import { useCallback, useEffect, useState } from 'react';

interface BackendStatusReturn {
	status: BackendStatus;
	retry: () => void;
}

type BackendStatus = 'fail' | 'loading' | 'success';

const useBackendStatus = (
	maxRetries: number = 10,
	retryDelay: number = 3000,
): BackendStatusReturn => {
	const [status, setStatus] = useState<BackendStatus>('loading');

	const checkStatus = useCallback(async (): Promise<void> => {
		setStatus('loading');
		let currentRetryCount = 0;

		while (currentRetryCount < maxRetries) {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`);
				if (response.ok) {
					setStatus('success');
					return;
				}
			} catch (error) {
				console.log(error);
				console.log('Backend not active yet, retrying...');
			}
			currentRetryCount++;
			await new Promise((resolve) => setTimeout(resolve, retryDelay));
		}
		setStatus('fail');
	}, [maxRetries, retryDelay]);

	useEffect(() => {
		void checkStatus();
	}, [checkStatus, maxRetries, retryDelay]);

	return { status, retry: checkStatus };
};

export default useBackendStatus;
