import { Plus, Sparkles, Target, CircleCheck } from 'lucide-react';

const steps = [
  {
    icon: Plus,
    title: 'Add Tasks & Set Durations',
    description: 'Create your routine by adding tasks and defining how long each one takes. Keep them short and manageable.'
  },
  {
    icon: Sparkles,
    title: 'Auto-Generated Visuals',
    description: 'The app generates a unique image for each task, making your routine visually memorable and engaging.'
  },
  {
    icon: Target,
    title: 'Enter Focus Mode',
    description: 'Follow your tasks in sequence with a timer for each. See only what matters right now—no distractions.'
  },
  {
    icon: CircleCheck,
    title: 'Complete & Track Progress',
    description: 'Mark tasks complete as you go. Build consistency day by day and watch your progress grow.'
  }
];

export function HowItWorks() {
  return (
    <section className="bg-gray-800 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-white">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Four simple steps to transform your daily routine into a focused, achievable practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-green-500">{index + 1}</span>
                </div>

                {/* Card */}
                <div className="h-full p-8 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-green-500/50 transition-colors duration-300">
                  <div className="mb-4 w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}