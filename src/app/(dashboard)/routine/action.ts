'use server';

import { getToken } from '@/app/(auth)/auth.server.service';
import { ImageFocus } from '@/lib/task/task.type';
import { BACKEND_URL } from '@/lib/consts';

export async function generateRoutineImage(
	routineId: string,
	routineName: string,
): Promise<string> {
	const token = await getToken();

	if (!token) throw new Error('User not authenticated');

	const body = { routineName, routineId };

	try {
		const response = await fetch(`${BACKEND_URL}/protected/generate-routine-image`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});

		return response.text();
	} catch (error) {
		console.error('Error making POST request:', error);
		return 'error';
	}
}

export async function generateTaskImage({
	routineId,
	taskId,
	taskName,
	focus,
}: {
	routineId: string;
	taskId: string;
	taskName: string;
	focus: ImageFocus;
}): Promise<string> {
	const token = await getToken();

	if (!token) throw new Error('User not authenticated');

	const body = { taskName, focus, routineId, taskId };

	try {
		const response = await fetch(`${BACKEND_URL}/protected/generate-task-image`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});

		return response.text();
	} catch (error) {
		console.error('Error making POST request:', error);
		return 'error';
	}
}
