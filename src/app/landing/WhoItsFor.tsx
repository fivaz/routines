import { Users, Target, Calendar } from 'lucide-react';

const audiences = [
	{
		icon: Users,
		title: 'Overwhelmed by To-Do Lists',
		description:
			'If long lists make you anxious, RoutineMaster breaks everything into manageable daily tasks.',
	},
	{
		icon: Target,
		title: 'Seeking Structure Without Rigidity',
		description:
			'Want a framework that guides without constraining? Our approach balances discipline and flexibility.',
	},
	{
		icon: Calendar,
		title: 'Building Habits Step by Step',
		description:
			'Starting small and staying consistent is the key. Perfect for anyone committed to gradual growth.',
	},
];

export function WhoItsFor() {
	return (
		<section className="bg-zinc-50 px-6 py-24 dark:bg-zinc-800">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-2xl text-zinc-900 dark:text-white">Who It's For</h2>
					<p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
						RoutineMaster is designed for anyone who wants clarity, focus, and sustainable progress.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{audiences.map((audience, index) => {
						const Icon = audience.icon;
						return (
							<div
								key={index}
								className="rounded-lg border border-zinc-200 bg-white p-8 transition-colors duration-300 hover:border-green-500/50 dark:border-zinc-700 dark:bg-zinc-900/50"
							>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
									<Icon className="h-6 w-6 text-green-600 dark:text-green-500" />
								</div>
								<h3 className="mb-3 text-zinc-900 dark:text-white">{audience.title}</h3>
								<p className="text-zinc-600 dark:text-zinc-400">{audience.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
