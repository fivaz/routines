import { ImageWithFallback } from './ImageWithFallback';

export function Hero() {
	return (
		<section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-900">
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0">
				<ImageWithFallback
					src="https://images.unsplash.com/photo-1505209487757-5114235191e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZGVzayUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjYxNDE3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
					alt="Minimal workspace"
					className="h-full w-full object-cover opacity-20"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-800" />
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
				<div className="mb-6 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
					<span className="text-green-500">One day at a time</span>
				</div>

				<h1 className="mb-6 tracking-tight text-white">
					Master Your Day with <span className="text-green-500">RoutineMaster</span>
				</h1>

				<p className="mx-auto mb-8 max-w-2xl text-gray-300">
					Daily routines, short tasks, focus mode, and gamified progression. Build lasting habits
					without the overwhelm.
				</p>

				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href="/register"
						className="rounded-lg bg-green-500 px-8 py-4 text-white transition-colors duration-200 hover:bg-green-600"
					>
						Start Your First Routine
					</a>
				</div>

				{/* Scroll Indicator */}
				<div className="mt-16 animate-bounce">
					<div className="mx-auto flex h-10 w-6 items-start justify-center rounded-full border-2 border-gray-600 p-2">
						<div className="h-3 w-1 rounded-full bg-green-500" />
					</div>
				</div>
			</div>
		</section>
	);
}
