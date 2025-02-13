'use client';
import { useState } from 'react';

import RoutineTaskListPage from '@/components/routine/routine-task-list-page';
import RoutineFocusPage from '@/components/routine/routine-focus-page/index';
import { RoutineRecapPage } from '@/components/routine/routine-recap-page';

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
