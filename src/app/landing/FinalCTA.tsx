import { ImageWithFallback } from './ImageWithFallback';

export function FinalCTA() {
	return (
		<section className="relative overflow-hidden bg-white px-6 py-32 dark:bg-zinc-900">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<ImageWithFallback
					src="https://images.unsplash.com/photo-1759661937582-0ccd5dacf20f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlseSUyMHBsYW5uZXIlMjBjaGVja2xpc3R8ZW58MXx8fHwxNzY2MTQxNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
					alt="Daily planner"
					className="h-full w-full object-cover opacity-5 dark:opacity-10"
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-4xl text-center">
				<h2 className="mb-6 text-zinc-900 dark:text-white">Start Simple. Stay Consistent.</h2>

				<p className="mx-auto mb-8 max-w-2xl text-zinc-600 dark:text-zinc-300">
					You don't need motivation. You need structure, clarity, and a system that meets you where
					you are. Build your first routine today.
				</p>

				<div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href="/register"
						className="rounded-lg bg-green-600 px-8 py-4 text-white transition-colors duration-200 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
					>
						Create Your Routine
					</a>
				</div>

				{/* Value Props */}
				<div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
					<div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-6 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/50">
						<div className="mb-2 text-green-600 dark:text-green-500">✓</div>
						<div className="text-zinc-600 dark:text-zinc-300">Focus on today only</div>
					</div>
					<div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-6 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/50">
						<div className="mb-2 text-green-600 dark:text-green-500">✓</div>
						<div className="text-zinc-600 dark:text-zinc-300">Reduce overwhelm</div>
					</div>
					<div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-6 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/50">
						<div className="mb-2 text-green-600 dark:text-green-500">✓</div>
						<div className="text-zinc-600 dark:text-zinc-300">Build lasting habits</div>
					</div>
				</div>
			</div>
		</section>
	);
}
