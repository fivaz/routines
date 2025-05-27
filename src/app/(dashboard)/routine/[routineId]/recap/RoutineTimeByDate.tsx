import { Session } from '@/lib/session/session.type';
import { getChartDataFromSessions } from '@/lib/session/session.utils';
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function RoutineTimeByDate({ sessions }: { sessions: Session[] }) {
	const data = getChartDataFromSessions(sessions);

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Elapsed Time per Day',
			},
		},
	};

	return (
		<div className="mx-auto w-full max-w-3xl">
			<Line data={data} options={options} />
		</div>
	);
}
