import { Skeleton } from '@/components/Skeleton';
import { useAtom, useAtomValue } from 'jotai';
import {
	currentSessionsAtom,
	taskIndexAtom,
} from '@/app/(dashboard)/routine/[routineId]/focus/service';
import { tasksAtom } from '@/lib/task/task.type';
import { getTaskSessions } from '@/lib/session/session.utils';

export function RoutineTasksSummary() {
	const tasks = useAtomValue(tasksAtom);
	const { data: sessions } = useAtomValue(currentSessionsAtom);
	const [currentIndex, setTaskIndex] = useAtom(taskIndexAtom);

	const hasSession = (index: number) => !!getTaskSessions(sessions, tasks[index]?.id).length;

	const changeTaskIndex = (index: number) => setTaskIndex(index);

	if (!tasks.length) {
		return <Skeleton className="w-full" />;
	}

	return (
		<div className="flex w-full gap-1 md:gap-2">
			{tasks.map((_, index) => (
				<button
					onClick={() => changeTaskIndex(index)}
					key={index}
					className={`h-2 grow cursor-pointer rounded ${index === currentIndex ? 'bg-blue-500' : hasSession(index) ? 'bg-green-500' : 'bg-gray-300'}`}
				/>
			))}
		</div>
	);
}
