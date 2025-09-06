import { getUserTokens } from '@/lib/config';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function Page() {
	const tokens = await getUserTokens(await cookies());

	if (!tokens) {
		notFound();
	}

	return (
		<div>
			Hello World {tokens?.decodedToken.email}
			<LogoutButton>logout</LogoutButton>
		</div>
	);
}
