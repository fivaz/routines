'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, RotateCcw, Square } from 'lucide-react';

type Task = {
	id: number;
	title: string;
	expectedDuration: number;
	startTime?: string; // ISO string
	endTime?: string; // ISO string
};

const formatTime = (seconds: number): string => {
	const m = Math.floor(seconds / 60)
		.toString()
		.padStart(2, '0');
	const s = (seconds % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
};

type TaskItemProps = {
	task: Task;
	isCurrent: boolean;
	elapsed: number;
	onStart: () => void;
	onStop: () => void;
	onRestart: () => void;
	onContinue: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({
	task,
	isCurrent,
	elapsed,
	onStart,
	onStop,
	onRestart,
	onContinue,
}) => {
	const hasStarted = !!task.startTime;
	const hasEnded = !!task.endTime;
	const isRunning = hasStarted && !hasEnded;

	const formatTimeString = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString() : '-');

	return (
		<div className={`p-4 border rounded shadow ${isCurrent ? 'bg-blue-50' : ''}`}>
			<h2 className="text-lg font-bold">{task.title}</h2>
			<p>Expected: {task.expectedDuration} min</p>
			<p>Start: {formatTimeString(task.startTime)}</p>
			<p>End: {formatTimeString(task.endTime)}</p>

			{isRunning && <p className="text-green-600 font-mono">⏱ {formatTime(elapsed)}</p>}

			{isCurrent && (
				<div className="mt-3 flex gap-3">
					{!hasStarted && (
						<button onClick={onStart} title="Start">
							<Play className="text-green-600 hover:scale-110" />
						</button>
					)}

					{isRunning && (
						<button onClick={onStop} title="Stop">
							<Square className="text-red-600 hover:scale-110" />
						</button>
					)}

					{hasStarted && hasEnded && (
						<>
							<button onClick={onContinue} title="Continue">
								<Play className="text-blue-600 hover:scale-110" />
							</button>
							<button onClick={onRestart} title="Restart">
								<RotateCcw className="text-yellow-600 hover:scale-110" />
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
};

const TasksList: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: 1,
			title: 'Task 1',
			expectedDuration: 25,
			startTime: '2025-05-23T10:18:35.882Z',
		},
		{
			id: 2,
			title: 'Task 2',
			expectedDuration: 15,
		},
		{
			id: 3,
			title: 'Task 3',
			expectedDuration: 30,
		},
	]);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);

	const currentTask = tasks[currentIndex];

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (currentTask?.startTime && !currentTask?.endTime) {
			const updateElapsed = () => {
				const now = Date.now();
				const start = new Date(currentTask.startTime!).getTime();
				setElapsedSeconds(Math.floor((now - start) / 1000));
			};

			updateElapsed();
			interval = setInterval(updateElapsed, 1000);
		} else {
			setElapsedSeconds(0);
		}

		console.log(tasks);

		return () => clearInterval(interval);
	}, [currentTask.startTime, currentTask?.endTime, currentIndex, tasks]);

	const updateTask = (index: number, update: Partial<Task>) => {
		const updated = [...tasks];
		updated[index] = { ...updated[index], ...update };
		setTasks(updated);
	};

	const nowISO = () => new Date().toISOString();

	const startTask = (index: number) => {
		updateTask(index, { startTime: nowISO(), endTime: undefined });
	};

	const stopTask = (index: number) => {
		updateTask(index, { endTime: nowISO() });
		setElapsedSeconds(0);
	};

	const restartTask = (index: number) => {
		updateTask(index, { startTime: nowISO(), endTime: undefined });
		setElapsedSeconds(0);
	};

	const continueTask = (index: number) => {
		updateTask(index, { endTime: undefined });
	};

	const prevTask = () => {
		setCurrentIndex((i) => Math.max(i - 1, 0));
		setElapsedSeconds(0);
	};

	const nextTask = () => {
		setCurrentIndex((i) => Math.min(i + 1, tasks.length - 1));
		setElapsedSeconds(0);
	};

	return (
		<div className="p-4 max-w-md mx-auto space-y-4">
			<div className="flex justify-between mb-2">
				<button onClick={prevTask} disabled={currentIndex === 0} title="Previous">
					<ArrowLeft className={`hover:scale-110 ${currentIndex === 0 ? 'opacity-30' : ''}`} />
				</button>
				<button onClick={nextTask} disabled={currentIndex === tasks.length - 1} title="Next">
					<ArrowRight
						className={`hover:scale-110 ${currentIndex === tasks.length - 1 ? 'opacity-30' : ''}`}
					/>
				</button>
			</div>

			{tasks.map((task, index) => (
				<TaskItem
					key={task.id}
					task={task}
					isCurrent={index === currentIndex}
					elapsed={index === currentIndex ? elapsedSeconds : 0}
					onStart={() => startTask(index)}
					onStop={() => stopTask(index)}
					onRestart={() => restartTask(index)}
					onContinue={() => continueTask(index)}
				/>
			))}
		</div>
	);
};

export default TasksList;
