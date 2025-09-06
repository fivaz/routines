import { useEffect, useState } from 'react';
import { Routes } from '@/lib/consts';
import useRouterWithQuery from '@/lib/utils.hook';
import { useAtom, useAtomValue } from 'jotai/index';
import { activeSessionAtom } from '@/app/(dashboard)/service';
import { taskIndexAtom } from '@/app/(dashboard)/routine/[routineId]/focus/service';

export default function ColdStartRestorer() {
	const router = useRouterWithQuery();

	const activeSession = useAtomValue(activeSessionAtom);
	const [, setTaskIndex] = useAtom(taskIndexAtom);

	useEffect(() => {
		// Wait for activeSession to be loaded
		if (activeSession === undefined || activeSession === null) return;

		const alreadyBooted = sessionStorage.getItem('hydrated');

		// Only set hydrated now, after activeSession exists
		sessionStorage.setItem('hydrated', 'true');

		if (!alreadyBooted) {
			// Redirect once on cold start
			setTaskIndex(activeSession.taskIndex);
			router.replace(Routes.FOCUS(activeSession.routineId));
		}
	}, [activeSession, router]);

	return null;
}
