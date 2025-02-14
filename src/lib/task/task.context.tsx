import React, {
	createContext,
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { Task } from '@/lib/task/task.type';
import { fetchTasks, updateTasks } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/user/auth-context';
import { useParams } from 'next/navigation';
import { move } from '@dnd-kit/helpers';

const TaskContext = createContext<{
	tasks: Task[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleSort: (event: any) => void;
	setTasks: Dispatch<SetStateAction<Task[]>>;
}>({
	tasks: [],
	handleSort: () => {},
	setTasks: () => {},
});

export function TaskProvider({ children }: PropsWithChildren) {
	const { user } = useAuth();
	const { routineId } = useParams<{ routineId: string }>();
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		if (!user?.uid || !routineId) return;

		const unsubscribe = fetchTasks(user.uid, routineId, setTasks);

		return () => unsubscribe();
	}, [user, routineId]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleSort(event: any) {
		console.log('handleSort');
		if (!user?.uid) return;
		setTasks((items) => {
			const newItems = move(items, event);

			void updateTasks(user.uid, routineId, newItems);

			return newItems;
		});
	}

	return (
		<TaskContext.Provider value={{ tasks, setTasks, handleSort }}>{children}</TaskContext.Provider>
	);
}

export const useTasks = () => useContext(TaskContext);
