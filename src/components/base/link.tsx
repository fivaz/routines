'use client';

import * as Headless from '@headlessui/react';
import NextLink, { type LinkProps } from 'next/link';
import React, { forwardRef } from 'react';
import { useSearchParams } from 'next/navigation';

// preserve query params across page change
function appendQueryParams(
	href: LinkProps['href'],
	searchParams: URLSearchParams,
): LinkProps['href'] {
	if (typeof href === 'string') {
		const queryString = searchParams.toString();
		if (!queryString) return href;

		const separator = href.includes('?') ? '&' : '?';
		return `${href}${separator}${queryString}`;
	}

	// Ensure href.query is an object
	const originalQuery = typeof href.query === 'object' && href.query !== null ? href.query : {};

	const mergedQuery = {
		...originalQuery,
		...Object.fromEntries(searchParams.entries()),
	};

	return {
		...href,
		query: mergedQuery,
	};
}

export const Link = forwardRef(function Link(
	props: LinkProps & React.ComponentPropsWithoutRef<'a'>,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	const searchParams = useSearchParams();
	const finalHref = appendQueryParams(props.href, searchParams);

	return (
		<Headless.DataInteractive>
			<NextLink {...props} href={finalHref} ref={ref} />
		</Headless.DataInteractive>
	);
});
