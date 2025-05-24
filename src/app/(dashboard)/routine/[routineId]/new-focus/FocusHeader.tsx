import { Heading } from '@/components/base/heading';
import { Skeleton } from '@/components/Skeleton';
import { Ellipsis, UndoIcon } from 'lucide-react';
import { Routine } from '@/lib/routine/routine.type';
import { Button } from '@/components/base/button';

export function FocusHeader({ routine }: { routine?: Routine }) {
	if (!routine) {
		return (
			<div className="flex justify-between items-center">
				<Skeleton />
				<Button outline disabled>
					<Ellipsis />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex justify-between items-center">
			<Heading className="first-letter:capitalize">{routine.name}</Heading>

			<Button outline href={`/routine/${routine.id}`}>
				<UndoIcon className="size-5" />
			</Button>
		</div>
	);
}
