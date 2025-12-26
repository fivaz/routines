'use server';

import { ImageFocus } from '@/lib/task/task.type';
import { BACKEND_URL } from '@/lib/const';
import { getToken } from '@/lib/auth/utils.actions';

export async function generateRoutineImage(
	routineId: string,
	routineName: string,
): Promise<string> {
	const token = await getToken();
	if (!token) throw new Error('Unable to generate image: User is not authenticated.');

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

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`Error generating routine image (Status: ${response.status} ${response.statusText}):`,
				errorText,
			);
			return 'error';
		}

		return response.text();
	} catch (error) {
		console.error('Network error while generating routine image:', error);
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
	if (!token) throw new Error('Unable to generate image: User is not authenticated.');

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

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`Error generating task image (Status: ${response.status} ${response.statusText}):`,
				errorText,
			);
			return 'error';
		}

		return response.text();
	} catch (error) {
		console.error('Network error while generating task image:', error);
		return 'error';
	}
}
