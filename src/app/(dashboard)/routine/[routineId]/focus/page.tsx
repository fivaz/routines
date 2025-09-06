'use client';
import { RoutineInfo } from '@/app/(dashboard)/routine/[routineId]/focus/RoutineInfo';
import { RoutineTasksSummary } from '@/app/(dashboard)/routine/[routineId]/focus/RoutineTasksSummary';
import { TaskImage } from '@/app/(dashboard)/routine/[routineId]/focus/TaskImage';
import { TaskInfo } from '@/app/(dashboard)/routine/[routineId]/focus/task-info/TaskInfo';
import { FocusController } from '@/app/(dashboard)/routine/[routineId]/focus/focus-controller/FocusController';
import { useAtomValue, useSetAtom } from 'jotai';
import { dateAtom } from '@/lib/session/session.type';
import { getToday } from '@/lib/session/session.utils';
import { resetTaskIndexOnRoutineChangeEffect } from '@/app/(dashboard)/routine/[routineId]/focus/service';

export default function RoutineFocusPage() {
	const setDate = useSetAtom(dateAtom);
	setDate(getToday());
	// Mount effect to reset the task index whenever routineId changes
	useAtomValue(resetTaskIndexOnRoutineChangeEffect);

	return (
		<div className="flex h-full flex-col justify-between gap-5 md:h-[calc(100vh-136px)]">
			<div className="flex flex-col gap-5">
				<RoutineInfo />

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
