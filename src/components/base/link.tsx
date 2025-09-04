'use client';

import * as Headless from '@headlessui/react';
import NextLink, { type LinkProps } from 'next/link';
import React, { forwardRef, useMemo } from 'react';

function appendQueryParams(href: LinkProps['href'], queryString: string): LinkProps['href'] {
	if (!queryString) return href;

	if (typeof href === 'string') {
		const separator = href.includes('?') ? '&' : '?';
		return `${href}${separator}${queryString}`;
	}

	// Ensure href.query is an object
	const originalQuery = typeof href.query === 'object' && href.query !== null ? href.query : {};

	const mergedQuery = {
		...originalQuery,
		...Object.fromEntries(new URLSearchParams(queryString).entries()),
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
	// Grab current query string once on the client
	const queryString = useMemo(() => {
		if (typeof window === 'undefined') return '';
		return window.location.search.slice(1); // drop leading "?"
	}, []);

	const finalHref = appendQueryParams(props.href, queryString);

	return (
		<Headless.DataInteractive>
			<NextLink {...props} href={finalHref} ref={ref} />
		</Headless.DataInteractive>
	);
});
