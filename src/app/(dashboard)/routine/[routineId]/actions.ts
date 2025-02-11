'use server';

import OpenAI from 'openai';

import { GoogleGenerativeAI } from '@google/generative-ai';

function wait(seconds) {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const recraftAi = new OpenAI({
	apiKey: process.env.RECRAFT_API_TOKEN,
	baseURL: 'https://external.api.recraft.ai/v1',
});

async function generatePromptFromTaskName(taskName: string): Promise<string> {
	await wait(3);
	return 'sauhsauhsau shau shau hau shau shau shuas ';

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
	// // Return a mock image URL
	try {
		const prompt = await generatePromptFromTaskName(taskName);

		await wait(3);
		return 'https://img.recraft.ai/k8a4Wj13sGTY_nsKrMaYwkvbqP-vrKvaOss0wAPCWaM/rs:fit:1024:1024:0/raw:1/plain/abs://external/images/383a110d-2afa-45d3-971a-63f5b8151b26';

		const response = await recraftAi.images.generate({
			prompt,
			style_id: process.env.RECRAFT_API_STYLE,
		});

		return response.data[0].url || '';
	} catch (error) {
		console.error('Error:', error);
		throw new Error('Failed to generate image');
	}
}
