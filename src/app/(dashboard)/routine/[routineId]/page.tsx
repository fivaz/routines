'use client';
import { useState } from 'react';

import RoutineTaskListPage from '@/app/(dashboard)/routine/[routineId]/routine-task-list-page';
import RoutineRecapPage from '@/app/(dashboard)/routine/[routineId]/routine-recap-page';

export default function Routine() {
	const [page, setPage] = useState<'recap' | 'list'>('list');

	return (
		<>
			{page === 'list' && <RoutineTaskListPage setPage={setPage} />}

			{page === 'recap' && <RoutineRecapPage />}
		</>
	);
}
