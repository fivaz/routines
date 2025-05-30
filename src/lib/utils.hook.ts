'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useRouterWithQuery() {
	const router = useRouter();
	const searchParams = useSearchParams();

	function withQueryParams(path: string): string {
		const query = searchParams.toString();
		if (!query) return path;

		const separator = path.includes('?') ? '&' : '?';
		return `${path}${separator}${query}`;
	}

	return {
		...router,
		push: (path: string) => router.push(withQueryParams(path)),
		replace: (path: string) => router.replace(withQueryParams(path)),
	};
}

export default useRouterWithQuery;
