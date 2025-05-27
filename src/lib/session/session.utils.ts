import { Session } from '@/lib/session/session.type';
import { differenceInSeconds, parseISO } from 'date-fns';

export function getToday(): string {
	return new Date().toISOString().split('T')[0];
}

export const getSessionsDuration = (sessions: Session[]): number =>
	sessions.reduce((total, session) => total + getSessionDuration(session), 0);

const getSessionDuration = (session: Session): number => {
	if (!session?.startAt) return 0;

	const start = parseISO(session.startAt);
	const end = session.endAt ? parseISO(session.endAt) : new Date();
	return differenceInSeconds(end, start);
};

export const getTotalElapsedTime = (sessions: Session[]) => getSessionsDuration(sessions);

export const getTaskSessions = (sessions: Session[], taskId: string | undefined) =>
	sessions.filter((session) => session.taskId === taskId);

export const getElapsedTimeByDate = (sessions: Session[]): Record<string, number> => {
	return sessions.reduce(
		(acc, session) => {
			const date = session.date;
			const duration = getSessionDuration(session);

			if (!acc[date]) {
				acc[date] = 0;
			}

			acc[date] += duration;
			return acc;
		},
		{} as Record<string, number>,
	);
};

export const getChartDataFromSessions = (sessions: Session[]) => {
	const elapsedByDate = getElapsedTimeByDate(sessions);
	const sortedDates = Object.keys(elapsedByDate).sort();

	return {
		labels: sortedDates,
		datasets: [
			{
				label: 'Elapsed Time (minutes)',
				data: sortedDates.map((date) => Math.round(elapsedByDate[date] / 60)), // Convert seconds to minutes
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};
};
