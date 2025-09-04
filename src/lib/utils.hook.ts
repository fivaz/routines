'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function useRouterWithQuery() {
	const router = useRouter();

	// Get current search params client-side
	const query = useMemo(() => {
		if (typeof window === 'undefined') return '';
		return window.location.search; // includes the "?" already if present
	}, []);

	function withQueryParams(path: string): string {
		if (!query) return path;

		const separator = path.includes('?') ? '&' : '?';
		return `${path}${separator}${query.slice(1)}`; // remove leading "?" since we add it
	}

	return {
		...router,
		push: (path: string) => router.push(withQueryParams(path)),
		replace: (path: string) => router.replace(withQueryParams(path)),
	};
}

export default useRouterWithQuery;
