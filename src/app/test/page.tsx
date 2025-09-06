import { getUserTokens } from '@/lib/config';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export default async function Page() {
	const tokens = await getUserTokens(await cookies());

	if (!tokens) {
		notFound();
	}

	return <div>Hello World {tokens?.decodedToken.email}</div>;
}
