import { useAuth } from '@/lib/user/auth-context';
import {
	addTask as addTaskRepo,
	deleteTask as deleteTaskRepo,
	editTask as editTaskRepo,
	fetchTasks,
	generateTaskImage as generateTaskImageRepo,
} from './task.repository';
import { ImageFocus, Task, tasksAtom } from './task.type';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export function useFetchTasks(userId?: string, routineId?: string) {
	const setTasks = useSetAtom(tasksAtom);

	useEffect(() => {
		if (!userId || !routineId) return;

		const unsubscribe = fetchTasks(userId, routineId, setTasks);
		return () => unsubscribe();
	}, [userId, routineId, setTasks]);
}

export function useTaskActions() {
	const { user } = useAuth();

	async function deleteTask(routineId: string, taskId: string) {
		if (!user?.uid) {
			console.log('No authenticated user found');
			return;
		}
		return deleteTaskRepo(user.uid, routineId, taskId);
	}

	async function editTask(params: {
		routineId: string;
		newRoutineId: string;
		imageFile: File | null;
		task: Task;
	}) {
		if (!user?.uid) {
			console.log('No authenticated user found');
			return;
		}
		return editTaskRepo({ userId: user.uid, ...params });
	}

	async function addTask(params: {
		routineId: string;
		task: Omit<Task, 'id'>;
		imageFile: File | null;
		focus: ImageFocus;
	}) {
		if (!user?.uid) {
			console.log('No authenticated user found');
			return;
		}

		const tokenId = await user.getIdToken();

		return addTaskRepo({ userId: user.uid, ...params, tokenId });
	}

	async function generateTaskImage(params: {
		routineId: string;
		taskId: string;
		taskName: string;
		focus: ImageFocus;
	}): Promise<string> {
		if (!user?.uid) {
			console.log('No authenticated user found');
			return 'error';
		}
		const tokenId = await user.getIdToken();
		return generateTaskImageRepo({ ...params, tokenId });
	}

	return { deleteTask, editTask, addTask, generateTaskImage };
}
