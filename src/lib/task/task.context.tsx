import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Task } from '@/lib/task/task.type';
import { fetchTasks, reorderTasks } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/auth-context';
import { useParams } from 'next/navigation';
import { arrayMove } from '@dnd-kit/sortable';

const TaskContext = createContext<{
	tasks: Task[];
	handleReorder: (newIndex: number, oldIndex: number) => void;
}>({
	tasks: [],
	handleReorder: () => {},
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

	const handleReorder = async (oldIndex: number, newIndex: number) => {
		if (!tasks || !user) return;

		const newTasks = arrayMove(tasks, oldIndex, newIndex);
		setTasks(newTasks);

		void reorderTasks(user.uid, routineId, newTasks);
	};

	return <TaskContext.Provider value={{ tasks, handleReorder }}>{children}</TaskContext.Provider>;
}

export const useTasks = () => useContext(TaskContext);
