import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { WhyRoutineMaster } from './WhyRoutineMaster';
import { WhoItsFor } from './WhoItsFor';
import { FinalCTA } from './FinalCTA';

export default function Landing() {
	return (
		<div className="min-h-screen bg-gray-800">
			<Hero />
			<HowItWorks />
			<WhyRoutineMaster />
			<WhoItsFor />
			<FinalCTA />
		</div>
	);
}
