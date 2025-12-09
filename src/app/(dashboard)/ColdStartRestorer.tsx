import { useEffect } from 'react';
import { Routes } from '@/lib/const';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai/index';
import { activeSessionAtom } from '@/app/(dashboard)/service';

export default function ColdStartRestorer() {
	const router = useRouter();

	const activeSession = useAtomValue(activeSessionAtom);

	useEffect(() => {
		// Wait for activeSession to be loaded
		if (activeSession === undefined || activeSession === null) return;

		const alreadyBooted = sessionStorage.getItem('hydrated');

		// Only set hydrated now, after activeSession exists
		sessionStorage.setItem('hydrated', 'true');

		if (!alreadyBooted) {
			// Redirect once on cold start
			router.replace(Routes.FOCUS(activeSession.routineId, activeSession.taskIndex));
		}
	}, [activeSession, router]);

	return null;
}
