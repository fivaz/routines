import { useState, useEffect } from 'react';
import type { Routine } from '@/lib/routine/routine.type';
import { Task } from '@/lib/task/task.type';
import { Button } from '@/components/base/button';
import { ChevronLeft, ChevronRight, CircleStop, Play } from 'lucide-react';
import Image from 'next/image';
import { formatSeconds } from '@/lib/task/task.utils';

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
				className="w-72 h-72 object-cover rounded-lg mb-4"
			/>

			<div className="flex flex-col gap-2 w-full">
				{/* Task Name & Timer */}
				<div className="mb-2">
					<h2 className="text-xl font-bold text-green-600">{currentTask.name}</h2>
					<p className="text-lg">
						{formatSeconds(elapsedTime) || '0s'} / {formatSeconds(currentTask.durationInSeconds)}
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
				<div className="flex items-center justify-between w-full max-w-md bg-gray-300 h-14">
					<div className="w-14 flex justify-start">
						{currentTaskIndex > 0 && (
							<button className="p-3" onClick={handlePrevTask}>
								<ChevronLeft />
							</button>
						)}
					</div>

					<button onClick={handleStartStop} className="p-3 flex-1 flex justify-center">
						{isRunning ? <CircleStop /> : <Play />}
					</button>

					<div className="w-14 flex justify-end">
						<button className="p-3" onClick={handleNextTask} disabled={isRunning}>
							<ChevronRight />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
