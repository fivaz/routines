import { Users, Target, Calendar } from 'lucide-react';

const audiences = [
  {
    icon: Users,
    title: 'Overwhelmed by To-Do Lists',
    description: 'If long lists make you anxious, RoutineMaster breaks everything into manageable daily tasks.'
  },
  {
    icon: Target,
    title: 'Seeking Structure Without Rigidity',
    description: 'Want a framework that guides without constraining? Our approach balances discipline and flexibility.'
  },
  {
    icon: Calendar,
    title: 'Building Habits Step by Step',
    description: 'Starting small and staying consistent is the key. Perfect for anyone committed to gradual growth.'
  }
];

export function WhoItsFor() {
  return (
    <section className="bg-gray-900 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-white">Who It's For</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            RoutineMaster is designed for anyone who wants clarity, focus, and sustainable progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <div key={index} className="p-8 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-green-500/50 transition-colors duration-300">
                <div className="mb-4 w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="mb-3 text-white">{audience.title}</h3>
                <p className="text-gray-400">{audience.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}