import { useState, useEffect } from 'react';
import type { Routine } from '@/lib/routine/routine.type';
import { Task } from '@/lib/task/task.type';
import { Button } from '@/components/base/button';
import { ChevronLeft, ChevronRight, CircleStop, Play } from 'lucide-react';
import Image from 'next/image';

export default function RoutineFocusMode({ routine, tasks }: { routine: Routine; tasks: Task[] }) {
	const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const currentTask = tasks[currentTaskIndex];

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;
		if (isRunning) {
			timer = setInterval(() => {
				setElapsedTime((prev) => prev + 1);
			}, 1000);
		}
		return () => timer && clearInterval(timer);
	}, [isRunning]);

	const handleStartStop = () => {
		if (!isRunning) {
			const startTime = new Date().toISOString();
			currentTask.history.push({ startAt: startTime, endAt: '' });
		} else {
			const endTime = new Date().toISOString();
			const lastEntry = currentTask.history[currentTask.history.length - 1];
			if (lastEntry) lastEntry.endAt = endTime;
		}
		setIsRunning(!isRunning);
	};

	const handleNextTask = () => {
		if (!isRunning && currentTaskIndex < tasks.length - 1) {
			setCurrentTaskIndex(currentTaskIndex + 1);
			setElapsedTime(0);
		}
	};

	const handlePrevTask = () => {
		if (currentTaskIndex > 0) {
			setCurrentTaskIndex(currentTaskIndex - 1);
			setElapsedTime(0);
		}
	};

	return (
		<div className="flex flex-col p-4 h-full justify-between items-center">
			{/* Task Indicators */}
			<div className="flex gap-2 mb-4">
				{tasks.map((task, index) => (
					<div
						key={index}
						className={`w-6 h-2 rounded ${
							index < currentTaskIndex
								? 'bg-green-500'
								: index === currentTaskIndex
									? 'bg-blue-500'
									: 'bg-gray-300'
						}`}
					/>
				))}
			</div>

			{/* Task Image */}
			<img
				src={currentTask.image}
				alt={currentTask.name}
				className="w-48 h-48 object-cover rounded-lg mb-4"
			/>

			<div>
				{/* Task Name & Timer */}
				<div className="text-center mb-2">
					<h2 className="text-xl font-bold">{currentTask.name}</h2>
					<p className="text-lg">
						{elapsedTime}s / {currentTask.durationInSeconds}s
					</p>
				</div>

				{/* Progress Bar */}
				<div className="relative w-full max-w-md h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
					<div
						className="h-full bg-green-500 transition-all"
						style={{ width: `${(elapsedTime / currentTask.durationInSeconds) * 100}%` }}
					/>
				</div>

				{/* Controls */}
				<div className="flex items-center justify-between w-full max-w-md">
					{currentTaskIndex > 0 && (
						<Button plain onClick={handlePrevTask}>
							<ChevronLeft />
						</Button>
					)}

					<Button plain onClick={handleStartStop} className="flex-1">
						{isRunning ? <CircleStop /> : <Play />}
					</Button>

					<Button plain onClick={handleNextTask} disabled={isRunning}>
						<ChevronRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
