import { Heading } from '@/components/base/heading';
import { Skeleton } from '@/components/Skeleton';
import { Ellipsis, UndoIcon } from 'lucide-react';
import { routineAtom } from '@/lib/routine/routine.type';
import { Button } from '@/components/base/button';
import { useAtomValue } from 'jotai/index';

export function RoutineInfo() {
	const routine = useAtomValue(routineAtom);

	if (!routine) {
		return (
			<div className="flex items-center justify-between">
				<Skeleton />
				<Button outline disabled>
					<Ellipsis />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-between">
			<Heading className="first-letter:capitalize">{routine.name}</Heading>

			<Button outline href={`/routine/${routine.id}`}>
				<UndoIcon className="size-5" />
			</Button>
		</div>
	);
}
