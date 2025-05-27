import { OffIcon } from '@/components/icons/OffIcon';
import { MoveLeftIcon, TrophyIcon } from 'lucide-react';
import { Heading } from '@/components/base/heading';
import { Button } from '@/components/base/button';
import { routineIdAtom } from '@/lib/routine/routine.type';
import { useAtomValue } from 'jotai';

export function EmptyFinishPage() {
	const routineId = useAtomValue(routineIdAtom);

	return (
		<div className="flex flex-col items-center justify-center gap-5 pt-32 md:pt-28">
			<OffIcon className="size-12 text-gray-400">
				<TrophyIcon className="size-12 text-gray-400" />
			</OffIcon>
			<Heading className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
				Nothing to Recap Yet!
			</Heading>
			<p className="mt-1 text-sm text-gray-500">
				Looks like you didn’t start the task series. Once you complete a session, you’ll see a full
				recap of your progress here. Ready to give it a try?
			</p>
			<Button outline href={`/routine/${routineId}`}>
				Return to focus mode <MoveLeftIcon className="size-5" />
			</Button>
		</div>
	);
}
