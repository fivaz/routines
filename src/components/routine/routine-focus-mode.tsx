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

				<div className="relative bg-gray-300 border-2 text-white border-white rounded-lg flex overflow-hidden h-14">
					{/* Progress Bar */}
					<div
						style={{ width: `${(elapsedTime / currentTask.durationInSeconds) * 100}%` }}
						className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-green-600 to-green-300 transition-all duration-100"
					></div>

					{/* Controls */}
					<div className="relative bg-transparent z-10 w-1/6 flex">
						{currentTaskIndex > 0 && (
							<button
								className="h-full w-full flex justify-center items-center"
								onClick={handlePrevTask}
							>
								<ChevronLeft className="w-7 h-7" />
							</button>
						)}
					</div>

					<button
						onClick={handleStartStop}
						className="relative bg-transparent z-10 p-3 w-4/6 flex justify-center"
					>
						{isRunning ? <CircleStop className="w-7 h-7" /> : <Play className="w-7 h-7" />}
					</button>

					<div className="relative bg-transparent z-10 w-1/6 flex">
						<button
							className="h-full w-full flex justify-center items-center"
							onClick={handleNextTask}
							disabled={isRunning}
						>
							<ChevronRight className="w-7 h-7" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
