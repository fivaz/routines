import { useCallback, useEffect, useState } from 'react';
import { BACKEND_URL } from '@/lib/const';

interface BackendStatusReturn {
	status: BackendStatus;
	retry: () => void;
	credits: number;
}

type BackendStatus = 'loading' | 'success' | 'error' | 'no-balance';

export function useBackendStatus(
	maxRetries: number = 10,
	retryDelay: number = 3000,
): BackendStatusReturn {
	const [status, setStatus] = useState<BackendStatus>('loading');
	const [credits, setCredits] = useState<number>(0);

	const checkStatus = useCallback(async (): Promise<void> => {
		setStatus('loading');
		let currentRetryCount = 0;

		while (currentRetryCount < maxRetries) {
			try {
				const response = await fetch(`${BACKEND_URL}/credits`);
				if (response.ok) {
					const data = await response.json();
					setCredits(data.credits);

					if (data.credits >= 40) {
						setStatus('success');
					} else {
						setStatus('no-balance');
					}
					return;
				} else {
					// Handle API error responses
					setStatus('error');
					return;
				}
			} catch (error) {
				console.log(error);
				console.log('Backend not active yet, retrying...');
			}
			currentRetryCount++;
			await new Promise((resolve) => setTimeout(resolve, retryDelay));
		}

		// After max retries, set status to error
		setStatus('error');
	}, [maxRetries, retryDelay]);

	useEffect(() => {
		void checkStatus();
	}, [checkStatus, maxRetries, retryDelay]);

	return { status, retry: checkStatus, credits };
}
