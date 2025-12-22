import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { WhyRoutineMaster } from './WhyRoutineMaster';
import { WhoItsFor } from './WhoItsFor';
import { FinalCTA } from './FinalCTA';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export default function Landing() {
	return (
		<div className="min-h-screen bg-white dark:bg-zinc-900">
			<div className="absolute top-6 right-6 z-10">
				<ThemeToggle />
			</div>
			<Hero />
			<HowItWorks />
			<WhyRoutineMaster />
			<WhoItsFor />
			<FinalCTA />
		</div>
	);
}
