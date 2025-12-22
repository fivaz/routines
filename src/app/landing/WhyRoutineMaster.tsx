import { Calendar, Timer, Zap } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const benefits = [
	{
		icon: Calendar,
		title: 'Single-Day Focus',
		description:
			'All tasks live within a single day. No endless lists or long-term overwhelm—just today.',
	},
	{
		icon: Timer,
		title: 'Short, Manageable Tasks',
		description:
			'Break down routines into bite-sized chunks. Small wins compound into lasting change.',
	},
	{
		icon: Zap,
		title: 'Reduces Anxiety',
		description:
			'Focus Mode shows only your current task and timer. No thinking about what comes next—just flow.',
	},
];

export function WhyRoutineMaster() {
	return (
		<section className="bg-gray-900 px-6 py-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-white">Why RoutineMaster</h2>
					<p className="mx-auto max-w-2xl text-gray-400">
						Designed for consistency, clarity, and calm. Structure creates freedom.
					</p>
				</div>

				<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
					{/* Image Side */}
					<div className="relative order-2 lg:order-1">
						<div className="aspect-square overflow-hidden rounded-2xl border border-gray-700">
							<ImageWithFallback
								src="https://images.unsplash.com/photo-1574406799118-d8ea94b544a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2N1c2VkJTIwbWVkaXRhdGlvbiUyMGNhbG18ZW58MXx8fHwxNzY2MTQxNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
								alt="Focused and calm"
								className="h-full w-full object-cover"
							/>
						</div>

						{/* Floating Quote */}
						<div className="absolute -right-6 -bottom-6 max-w-xs rounded-lg border border-green-500/30 bg-gray-800 p-6 shadow-xl">
							<p className="text-green-500 italic">"Consistency beats motivation"</p>
						</div>
					</div>

					{/* Benefits Side */}
					<div className="order-1 space-y-8 lg:order-2">
						{benefits.map((benefit, index) => {
							const Icon = benefit.icon;
							return (
								<div key={index} className="flex gap-4">
									<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10">
										<Icon className="h-6 w-6 text-green-500" />
									</div>
									<div>
										<h3 className="mb-2 text-white">{benefit.title}</h3>
										<p className="text-gray-400">{benefit.description}</p>
									</div>
								</div>
							);
						})}

						{/* Philosophy Cards */}
						<div className="mt-12 grid grid-cols-1 gap-4">
							<div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
								<p className="text-gray-300">"One day at a time"</p>
							</div>
							<div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
								<p className="text-gray-300">"Structure creates freedom"</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
