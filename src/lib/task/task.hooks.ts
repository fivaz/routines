import { useAuth } from '../user/auth-context';
import { useTasks } from '@/lib/task/task.context';
import { addTaskServer } from '@/lib/task/task.repository';
import { Task } from '@/lib/task/task.type';
import { ImageFocus } from '@/app/(dashboard)/routine/[routineId]/actions';

export function useAddTask() {
	const { user } = useAuth();
	const { setTasks } = useTasks();

	function addTask(task: Task, routineId: string, imageFile: File | null, focus: ImageFocus) {
		if (!user?.uid) return;
		setTasks((prevTasks) => [...prevTasks, task]);
		void addTaskServer(user.uid, routineId, task, imageFile, focus);
	}

	return {
		addTask,
	};
}
