import { Button } from '@/components/base/button';
import { Text } from '@/components/base/text';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { addDays, format, subDays } from 'date-fns';
import { yyyyMMdd } from '@/lib/consts';
import { getToday } from '@/lib/session/session.utils';

export function TaskHistoryCarousel({
	date,
	setDate,
}: {
	date: string;
	setDate: (date: string) => void;
}) {
	function isToday() {
		return date === getToday();
	}

	function goToNextDay() {
		setDate(format(addDays(date, 1), yyyyMMdd));
	}

	function goToPreviousDay() {
		setDate(format(subDays(date, 1), yyyyMMdd));
	}

	return (
		<div className="flex items-center justify-between rounded-lg border border-gray-200">
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
