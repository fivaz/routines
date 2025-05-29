import {
	addTask as addTaskRepo,
	deleteTask as deleteTaskRepo,
	editTask as editTaskRepo,
	fetchTasks,
	generateTaskImage as generateTaskImageRepo,
	updateTasksOrder as updateTasksRepo,
} from './task.repository';
import { ImageFocus, Task, tasksAtom, tasksLoadingAtom } from './task.type';
import { atomEffect } from 'jotai-effect';
import { currentUserDataAtom } from '@/lib/user/user.type';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { safeThrow, safeThrowUnauthorized } from '@/lib/error-handle';
import { useAtomValue } from 'jotai/index';

export const tasksAtomEffect = atomEffect((get, set) => {
	const user = get(currentUserDataAtom);
	const routineId = get(routineIdAtom);
	const setTasks = (tasks: Task[]) => set(tasksAtom, tasks);
	const setLoading = (loading: boolean) => set(tasksLoadingAtom, loading);

	setLoading(true); // Set loading true at the start

	if (!user?.uid || !routineId) {
		setTasks([]);
		setLoading(false);
		return;
	}

	const unsubscribe = fetchTasks(user.uid, routineId, (tasks) => {
		setTasks(tasks);
		setLoading(false); // Only set false when tasks are fully fetched
	});

	return () => unsubscribe();
});

export function useTaskActions(routineId: string) {
	const user = useAtomValue(currentUserDataAtom);

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

	async function updateTasks(tasks: Task[]) {
		if (!user?.uid) {
			return safeThrowUnauthorized();
		}
		if (!routineId) {
			return safeThrow('routine id is missing');
		}
		return updateTasksRepo(user.uid, routineId, tasks);
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

	return { deleteTask, editTask, addTask, generateTaskImage, updateTasks };
}
