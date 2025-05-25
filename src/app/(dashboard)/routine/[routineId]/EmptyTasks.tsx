import { ListIcon } from '@/components/icons/ListIcon';
import { Button } from '@/components/base/button';
import { PlusIcon } from 'lucide-react';

export function EmptyTasks({ handleAddTask }: { handleAddTask: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center pt-32 md:pt-28">
			<ListIcon className="size-12 text-gray-400" />
			<h2 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">Add tasks</h2>
			<p className="mt-1 text-sm text-gray-500">You haven’t added any task to your routine yet.</p>
			<Button onClick={handleAddTask} color="green" className="mt-2">
				<PlusIcon className="size-5" />
				Add Task
			</Button>
		</div>
	);
}
