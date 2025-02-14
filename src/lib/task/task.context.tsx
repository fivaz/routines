import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Task } from '@/lib/task/task.type';
import { fetchTasks } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/auth-context';
import { useParams } from 'next/navigation';

const TaskContext = createContext<{
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}>({
	tasks: [],
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

	return <TaskContext.Provider value={{ tasks, setTasks }}>{children}</TaskContext.Provider>;
}

export const useTasks = () => useContext(TaskContext);
