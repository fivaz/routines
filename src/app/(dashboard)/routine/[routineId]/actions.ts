'use server';

import OpenAI from 'openai';

/* eslint-disable @typescript-eslint/no-namespace */
declare module 'openai' {
	namespace OpenAI.Images {
		interface ImageGenerateParams {
			style_id: string;
		}
	}
}
/* eslint-enable @typescript-eslint/no-namespace */

import { GoogleGenerativeAI } from '@google/generative-ai';

const recraftAi = new OpenAI({
	apiKey: process.env.RECRAFT_API_TOKEN,
	baseURL: 'https://external.api.recraft.ai/v1',
});

async function generatePromptFromTaskName(taskName: string): Promise<string> {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_TOKEN!);
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

	const prompt = `
	You are an expert in crafting vivid, engaging image prompts. Your task is to transform a simple task name into 
    a rich, immersive image description that illustrates a person performing the task in an enjoyable and inviting way.
    
    - Clearly depict a person actively engaged in the task.
    - Unless the task explicitly specifies a different gender, assume the person is a man.
    - Emphasize body language and facial expressions that convey enjoyment, focus, or relaxation.
    - Describe the environment in a way that makes the scene feel pleasant, warm, or inspiring.
    - Include details about lighting, surroundings, and small elements that enhance the mood.
    - Keep the description under 1000 characters.
    
    Task: "${taskName}"
    
    Image Description:
    `;

	const result = await model.generateContent(prompt);
	return result.response.text();
}

export async function generateImage(taskName: string): Promise<string> {
	try {
		const prompt = await generatePromptFromTaskName(taskName);

		const response = await recraftAi.images.generate({
			prompt,
			style_id: process.env.RECRAFT_API_STYLE!,
		});

		return response.data[0].url || '';
	} catch (error) {
		console.error('Error:', error);
		throw new Error('Failed to generate image');
	}
}
