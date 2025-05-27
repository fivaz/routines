import { Text } from '@/components/base/text';
import { Skeleton } from '@/components/Skeleton';

export function FinishTaskListSkeleton() {
	return (
		<ul role="list" className="flex flex-wrap justify-between gap-3">
			{[...Array(3)].map((_, index) => (
				<div key={index} className="w-full md:w-[32%]">
					<FinishTaskRowSkeleton />
				</div>
			))}
		</ul>
	);
}

function FinishTaskRowSkeleton() {
	return (
		<li className="flex flex-col gap-2 rounded-md border border-gray-200 p-4 dark:border-gray-700">
			<Skeleton />
			<div className="flex gap-3">
				<div className="h-auto w-1/2 animate-pulse rounded-md bg-gray-300 dark:bg-gray-800" />
				<div className="flex flex-col">
					<Text>complete in:</Text>
					<Skeleton />

					<Text>time expected:</Text>
					<Skeleton />

					<Text>difference:</Text>
					<Skeleton />
				</div>
			</div>
		</li>
	);
}
