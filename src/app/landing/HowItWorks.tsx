import { Plus, Sparkles, Target, CircleCheck } from 'lucide-react';

const steps = [
	{
		icon: Plus,
		title: 'Add Tasks & Set Durations',
		description:
			'Create your routine by adding tasks and defining how long each one takes. Keep them short and manageable.',
	},
	{
		icon: Sparkles,
		title: 'Auto-Generated Visuals',
		description:
			'The app generates a unique image for each task, making your routine visually memorable and engaging.',
	},
	{
		icon: Target,
		title: 'Enter Focus Mode',
		description:
			'Follow your tasks in sequence with a timer for each. See only what matters right now—no distractions.',
	},
	{
		icon: CircleCheck,
		title: 'Complete & Track Progress',
		description:
			'Mark tasks complete as you go. Build consistency day by day and watch your progress grow.',
	},
];

export function HowItWorks() {
	return (
		<section className="bg-zinc-50 px-6 py-24 dark:bg-zinc-800">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-zinc-900 dark:text-white">How It Works</h2>
					<p className="mx-auto max-w-2xl text-zinc-600 dark:text-zinc-400">
						Four simple steps to transform your daily routine into a focused, achievable practice.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div key={index} className="relative">
								{/* Step Number */}
								<div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
									<span className="text-green-600 dark:text-green-500">{index + 1}</span>
								</div>

								{/* Card */}
								<div className="h-full rounded-lg border border-zinc-200 bg-white p-8 transition-colors duration-300 hover:border-green-500/50 dark:border-zinc-700 dark:bg-zinc-900/50">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
										<Icon className="h-6 w-6 text-green-600 dark:text-green-500" />
									</div>
									<h3 className="mb-3 text-zinc-900 dark:text-white">{step.title}</h3>
									<p className="text-zinc-600 dark:text-zinc-400">{step.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
