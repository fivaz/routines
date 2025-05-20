'use client';
import { useState } from 'react';

import RoutineTaskListPage from '@/app/(dashboard)/routine/[routineId]/routine-task-list-page';
import RoutineFocusPage from '@/app/(dashboard)/routine/[routineId]/routine-focus-page/index';
import RoutineRecapPage from '@/app/(dashboard)/routine/[routineId]/routine-recap-page';

export default function Routine() {
	const [page, setPage] = useState<'focus' | 'recap' | 'list'>('list');

	return (
		<>
			{page === 'list' && <RoutineTaskListPage setPage={setPage} />}

			{page === 'focus' && <RoutineFocusPage setPage={setPage} />}

			{page === 'recap' && <RoutineRecapPage setPage={setPage} />}
		</>
	);
}
