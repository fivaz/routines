'use client';
import { ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Link } from '@/components/base/link';

export function Hero() {
	const scrollToHowItWorks = () => {
		const element = document.getElementById('how-it-works');
		element?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white dark:bg-zinc-900">
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0">
				<ImageWithFallback
					src="https://images.unsplash.com/photo-1505209487757-5114235191e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZGVzayUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjYxNDE3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
					alt="Minimal workspace"
					className="h-full w-full object-cover opacity-10 dark:opacity-20"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-zinc-50 dark:from-zinc-900/80 dark:via-zinc-900/90 dark:to-zinc-800" />
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
				<div className="mb-6 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
					<span className="text-green-600 dark:text-green-500">One day at a time</span>
				</div>

				<h1 className="mb-6 tracking-tight text-zinc-900 dark:text-white">
					Master Your Day with{' '}
					<span className="text-lg font-semibold text-green-600 dark:text-green-500">
						RoutineMaster
					</span>
				</h1>

				<p className="mx-auto mb-8 max-w-2xl text-zinc-600 dark:text-zinc-300">
					Daily routines, short tasks, focus mode, and gamified progression. Build lasting habits
					without the overwhelm.
				</p>

				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link
						href="/register"
						className="rounded-lg bg-green-600 px-8 py-4 text-white transition-colors duration-200 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
					>
						Start Your First Routine
					</Link>
				</div>
			</div>
			{/* Scroll Indicator */}
			<div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
				<button
					onClick={scrollToHowItWorks}
					className="flex size-10 animate-bounce cursor-pointer items-center justify-center rounded-full bg-green-600 transition hover:bg-green-400 active:scale-95"
					aria-label="Scroll to How It Works"
				>
					<ChevronDown className="size-6 text-white" />
				</button>
			</div>
		</section>
	);
}
