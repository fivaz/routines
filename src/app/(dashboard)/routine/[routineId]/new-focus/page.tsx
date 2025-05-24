'use client';
import { useRoutine } from '@/lib/routine/routine.hooks';
import { useMemo, useState } from 'react';
import { FocusHeader } from '@/app/(dashboard)/routine/[routineId]/new-focus/FocusHeader';
import { RoutineTasksSummary } from '@/app/(dashboard)/routine/[routineId]/new-focus/RoutineTasksSummary';
import { TaskImage } from '@/app/(dashboard)/routine/[routineId]/new-focus/TaskImage';
import { FocusFooter } from '@/app/(dashboard)/routine/[routineId]/new-focus/focus-footer/FocusFooter';
import { Task } from '@/lib/task/task.type';
import { useTasks } from '@/lib/task/task.context';
import { FocusController } from '@/app/(dashboard)/routine/[routineId]/new-focus/focus-controller/FocusController';

export default function RoutineFocusPage() {
	const routine = useRoutine();
	const [taskIndex, setTaskIndex] = useState(0);
	const { tasks } = useTasks();
	const task: Task | undefined = useMemo(() => tasks[taskIndex], [taskIndex, tasks]);

	return (
		<div className="flex flex-col gap-5 h-full md:h-[calc(100vh-136px)]">
			<FocusHeader routine={routine} />

			<RoutineTasksSummary setTaskIndex={setTaskIndex} currentIndex={taskIndex} />

			<TaskImage task={task} taskIndex={taskIndex} />

			<FocusFooter task={task} />

			<FocusController taskIndex={taskIndex} setTaskIndex={setTaskIndex} task={task} />
		</div>
	);
}
