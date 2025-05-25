import { Skeleton } from '@/components/Skeleton';
import { useAtom } from 'jotai';
import {
	sessionsAtom,
	taskIndexAtom,
} from '@/app/(dashboard)/routine/[routineId]/new-focus/service';
import { Task, tasksAtom } from '@/lib/task/task.type';

export function RoutineTasksSummary() {
	const [tasks] = useAtom(tasksAtom);
	const [sessions] = useAtom(sessionsAtom);
	const [currentIndex, setTaskIndex] = useAtom(taskIndexAtom);

	const hasSession = (index: number) => {
		const task: Task | undefined = tasks[index];
		return sessions.find((session) => session.taskId === task?.id);
	};

	const changeTaskIndex = (index: number) => setTaskIndex(index);

	if (!tasks.length) {
		return <Skeleton className="w-full" />;
	}

	return (
		<div className="flex w-full md:gap-2 gap-1">
			{tasks.map((_, index) => (
				<button
					onClick={() => changeTaskIndex(index)}
					key={index}
					className={`cursor-pointer grow h-2 rounded ${index === currentIndex ? 'bg-blue-500' : hasSession(index) ? 'bg-green-500' : 'bg-gray-300'}`}
				/>
			))}
		</div>
	);
}
