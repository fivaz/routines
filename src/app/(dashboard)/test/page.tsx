'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, RotateCcw, Square } from 'lucide-react';
import { differenceInSeconds, format, parseISO } from 'date-fns';

const getToday = () => format(new Date(), 'yyyy-MM-dd');

const formatTime = (seconds: number): string => {
	const m = Math.floor(seconds / 60)
		.toString()
		.padStart(2, '0');
	const s = (seconds % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
};

type Session = {
	date: string; // 'YYYY-MM-DD'
	startTime: string; // ISO
	endTime?: string; // ISO
};

type Task = {
	id: number;
	title: string;
	expectedDuration: number;
	sessions: Session[];
};

type TaskItemProps = {
	task: Task;
	isCurrent: boolean;
	elapsed: number;
	onStart: () => void;
	onStop: () => void;
	onRestart: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({
	task,
	isCurrent,
	elapsed,
	onStart,
	onStop,
	onRestart,
}) => {
	const today = getToday();
	const todaySession = task.sessions.find((s) => s.date === today);
	const isRunning = !!todaySession?.startTime && !todaySession?.endTime;
	const hasEnded = !!todaySession?.endTime;

	const formatTimeString = (iso?: string) => (iso ? format(parseISO(iso), 'HH:mm:ss') : '-');

	return (
		<div className={`p-4 border rounded shadow ${isCurrent ? 'bg-blue-50' : ''}`}>
			<h2 className="text-lg font-bold">{task.title}</h2>
			<p>Expected: {task.expectedDuration} min</p>
			<p>Start: {formatTimeString(todaySession?.startTime)}</p>
			<p>End: {formatTimeString(todaySession?.endTime)}</p>

			{isRunning && <p className="text-green-600 font-mono">⏱ {formatTime(elapsed)}</p>}

			{isCurrent && (
				<div className="mt-3 flex gap-3">
					{!todaySession && (
						<button onClick={onStart} title="Start">
							<Play className="text-green-600 hover:scale-110" />
						</button>
					)}
					{isRunning && (
						<button onClick={onStop} title="Stop">
							<Square className="text-red-600 hover:scale-110" />
						</button>
					)}
					{todaySession && todaySession.startTime && todaySession.endTime && (
						<button onClick={onRestart} title="Restart">
							<RotateCcw className="text-yellow-600 hover:scale-110" />
						</button>
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
			sessions: [],
		},
		{
			id: 2,
			title: 'Task 2',
			expectedDuration: 15,
			sessions: [],
		},
		{
			id: 3,
			title: 'Task 3',
			expectedDuration: 30,
			sessions: [],
		},
	]);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);

	const currentTask = tasks[currentIndex];
	const today = getToday();
	const todaySession = currentTask.sessions.find((s) => s.date === today);

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (todaySession?.startTime && !todaySession?.endTime) {
			const updateElapsed = () => {
				const now = new Date();
				const start = parseISO(todaySession.startTime);
				setElapsedSeconds(differenceInSeconds(now, start));
			};

			updateElapsed();
			interval = setInterval(updateElapsed, 1000);
		} else {
			setElapsedSeconds(0);
		}

		return () => clearInterval(interval);
	}, [todaySession?.startTime, todaySession?.endTime, currentIndex]);

	const updateTask = (index: number, updatedSessions: Session[]) => {
		const updated = [...tasks];
		updated[index] = { ...updated[index], sessions: updatedSessions };
		setTasks(updated);
	};

	const startTask = () => {
		const now = new Date().toISOString();
		const sessions = [...currentTask.sessions];
		const existing = sessions.find((s) => s.date === today);
		if (!existing) {
			sessions.push({ date: today, startTime: now });
			updateTask(currentIndex, sessions);
		}
	};

	const stopTask = () => {
		const now = new Date().toISOString();
		const sessions = currentTask.sessions.map((s) =>
			s.date === today ? { ...s, endTime: now } : s,
		);
		updateTask(currentIndex, sessions);
		setElapsedSeconds(0);
	};

	const restartTask = () => {
		const now = new Date().toISOString();
		const sessions = currentTask.sessions.map((s) =>
			s.date === today ? { date: today, startTime: now } : s,
		);
		updateTask(currentIndex, sessions);
		setElapsedSeconds(0);
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
					onStart={startTask}
					onStop={stopTask}
					onRestart={restartTask}
				/>
			))}
		</div>
	);
};

export default TasksList;
