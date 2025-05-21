import { useAuth } from '@/lib/user/auth-context';
import {
	addTask as addTaskRepo,
	deleteTask as deleteTaskRepo,
	editTask as editTaskRepo,
} from './task.repository';
import { ImageFocus, Task } from './task.type';

export function useTaskActions() {
	const { user } = useAuth();

	async function deleteTask(routineId: string, taskId: string) {
		if (!user?.uid) {
			console.log('No authenticated user found');
			return;
		}
		return await deleteTaskRepo(user.uid, routineId, taskId);
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
		return await editTaskRepo({ userId: user.uid, ...params });
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

		return await addTaskRepo({ userId: user.uid, ...params, tokenId });
	}

	return { deleteTask, editTask, addTask };
}
