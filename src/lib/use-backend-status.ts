import { useCallback, useEffect, useState } from 'react';

interface BackendStatus {
	isBackendActive: boolean;
	isLoading: boolean;
	retry: () => void;
}

const useBackendStatus = (maxRetries: number = 10, retryDelay: number = 3000): BackendStatus => {
	const [isBackendActive, setIsBackendActive] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const checkStatus = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		let currentRetryCount = 0;

		while (currentRetryCount < maxRetries) {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ping`);
				if (response.ok) {
					setIsBackendActive(true);
					setIsLoading(false);
					return;
				}
			} catch (error) {
				console.log(error);
				console.log('Backend not active yet, retrying...');
			}
			currentRetryCount++;
			await new Promise((resolve) => setTimeout(resolve, retryDelay));
		}
		setIsLoading(false); // Stop loading after max retries
	}, [maxRetries, retryDelay]);

	useEffect(() => {
		checkStatus();
	}, [checkStatus, maxRetries, retryDelay]);

	return { isBackendActive, isLoading, retry: checkStatus };
};

export default useBackendStatus;
