import { Skeleton } from '@/components/Skeleton';
import { GripVerticalIcon } from 'lucide-react';
import { Button } from '@/components/base/button';
import { useAtomValue } from 'jotai/index';
import { routinesLoadingAtom } from '@/lib/routine/routine.type';

export function RoutineListSkeleton() {
	const routinesLoading = useAtomValue(routinesLoadingAtom);

	if (routinesLoading) {
		return (
			<div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
				<div className="flex items-center gap-2">
					<Button outline disabled className="touch-none bg-white p-1 dark:bg-gray-900">
						<GripVerticalIcon className="size-4" />
					</Button>
					<Skeleton />
				</div>
				<div className="flex min-h-45 flex-col gap-2">
					<div className="flex flex-col gap-2">
						{[...Array(3)].map((_, index) => (
							<RoutineRowSkeleton key={index} />
						))}
					</div>
				</div>
			</div>
		);
	}
}

function RoutineRowSkeleton() {
	return (
		<div className="bg- flex h-40 animate-pulse flex-col rounded-lg bg-gray-300 dark:bg-gray-800">
			<div className="grid h-full w-full grid-cols-2 grid-rows-2 p-4">
				<div className="col-span-1 col-start-1 row-span-1 row-start-2 self-end p-0.5 group-hover:underline first-letter:uppercase">
					<Skeleton />
				</div>
			</div>
		</div>
	);
}
