'use client';
import { useRoutine } from '@/lib/routine/routine.hooks';
import { FocusHeader } from '@/app/(dashboard)/routine/[routineId]/new-focus/FocusHeader';
import { RoutineTasksSummary } from '@/app/(dashboard)/routine/[routineId]/new-focus/RoutineTasksSummary';
import { TaskImage } from '@/app/(dashboard)/routine/[routineId]/new-focus/TaskImage';
import { FocusFooter } from '@/app/(dashboard)/routine/[routineId]/new-focus/focus-footer/FocusFooter';
import { FocusController } from '@/app/(dashboard)/routine/[routineId]/new-focus/focus-controller/FocusController';

export default function RoutineFocusPage() {
	const routine = useRoutine();

	return (
		<div className="flex flex-col gap-5 h-full md:h-[calc(100vh-136px)]">
			<FocusHeader routine={routine} />

			<RoutineTasksSummary />

			<TaskImage />

			<FocusFooter />

			<FocusController />
		</div>
	);
}
