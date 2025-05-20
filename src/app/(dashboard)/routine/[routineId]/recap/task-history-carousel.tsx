import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/base/button';
import { Text } from '@/components/base/text';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { addDays, format, subDays } from 'date-fns';
import { yyyyMMdd } from '@/lib/consts';

export function TaskHistoryCarousel({
	date,
	setDate,
}: {
	date: string;
	setDate: Dispatch<SetStateAction<string>>;
}) {
	function isToday() {
		return date === new Date().toISOString().split('T')[0];
	}

	function goToNextDay() {
		setDate((date) => format(addDays(date, 1), yyyyMMdd));
	}

	function goToPreviousDay() {
		setDate((date) => format(subDays(date, 1), yyyyMMdd));
	}

	return (
		<div className="flex justify-between items-center border border-gray-200 rounded-lg">
			<Button outline disabled={isToday()} onClick={goToNextDay}>
				<ChevronLeftIcon />
			</Button>
			<Text>{format(date, 'MMM dd, yyyy')}</Text>
			<Button outline onClick={goToPreviousDay}>
				<ChevronRightIcon />
			</Button>
		</div>
	);
}
