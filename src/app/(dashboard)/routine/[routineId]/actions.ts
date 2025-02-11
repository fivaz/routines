'use server';

import OpenAI from 'openai';

const client = new OpenAI({
	apiKey: process.env.RECRAFT_API_TOKEN,
	baseURL: 'https://external.api.recraft.ai/v1',
});

export async function generateImage(prompt: string) {
	console.log('prompt', prompt);
	console.log('process.env.RECRAFT_API_STYLE:', process.env.RECRAFT_API_STYLE);
	// await new Promise((resolve) => setTimeout(resolve, 1000));
	//
	// // Return a mock image URL
	// return { imageUrl: '/mock.png' };
	try {
		const response = await client.images.generate({
			prompt,
			style_id: process.env.RECRAFT_API_STYLE,
		});

		const imageUrl = response.data[0].url;
		return { imageUrl };
	} catch (error) {
		console.error('Error:', error);
		throw new Error('Failed to generate image');
	}
}
