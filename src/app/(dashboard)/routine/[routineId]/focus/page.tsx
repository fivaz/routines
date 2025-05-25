'use client';
import { useRoutine } from '@/lib/routine/routine.hooks';
import { RoutineInfo } from '@/app/(dashboard)/routine/[routineId]/focus/RoutineInfo';
import { RoutineTasksSummary } from '@/app/(dashboard)/routine/[routineId]/focus/RoutineTasksSummary';
import { TaskImage } from '@/app/(dashboard)/routine/[routineId]/focus/TaskImage';
import { TaskInfo } from '@/app/(dashboard)/routine/[routineId]/focus/task-info/TaskInfo';
import { FocusController } from '@/app/(dashboard)/routine/[routineId]/focus/focus-controller/FocusController';

export default function RoutineFocusPage() {
	const routine = useRoutine();

	return (
		<div className="flex h-full flex-col justify-between gap-5 md:h-[calc(100vh-136px)]">
			<div className="flex flex-col gap-5">
				<RoutineInfo routine={routine} />

				<RoutineTasksSummary />
			</div>

			<TaskImage />

			<div className="flex flex-col gap-5">
				<TaskInfo />

				<FocusController />
			</div>
		</div>
	);
}
