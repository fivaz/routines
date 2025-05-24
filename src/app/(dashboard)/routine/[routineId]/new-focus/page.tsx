'use client';
import { Text } from '@/components/base/text';
import { useRoutine } from '@/lib/routine/routine.hooks';
import { useState } from 'react';
import { FocusHeader } from '@/app/(dashboard)/routine/[routineId]/new-focus/FocusHeader';
import { RoutineTasksSummary } from '@/app/(dashboard)/routine/[routineId]/new-focus/RoutineTasksSummary';

export default function RoutineFocusPage() {
	const routine = useRoutine();
	const [taskIndex, setTaskIndex] = useState(0);

	return (
		<div className="flex flex-col gap-5 h-full md:h-[calc(100vh-136px)]">
			<FocusHeader routine={routine} />

			<RoutineTasksSummary setTaskIndex={setTaskIndex} currentIndex={taskIndex} />

			<div className="flex overflow-hidden aspect-square items-center justify-center">
				<Text>currenTask</Text>
			</div>

			<Text>RoutineFocusBottom</Text>
		</div>
	);
}
