'use server';

export async function generateImage(prompt: string) {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Return a mock image URL
	return { imageUrl: '/mock.png' };
}
