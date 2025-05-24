import { useSessions } from '@/lib/session/session.context';
import { useTasks } from '@/lib/task/task.context';
import { Skeleton } from '@/components/Skeleton';

export function RoutineTasksSummary({
	currentIndex,
	setTaskIndex,
}: {
	currentIndex: number;
	setTaskIndex: (taskIndex: number) => void;
}) {
	const { tasks } = useTasks();
	const { sessions } = useSessions();

	const hasSession = (index: number) => {
		const currentTask = tasks[index];
		return sessions.find((session) => session.taskId === currentTask.id);
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
