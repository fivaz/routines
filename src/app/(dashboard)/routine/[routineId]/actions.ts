'use server';

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

/* eslint-disable @typescript-eslint/no-namespace */
declare module 'openai' {
	namespace OpenAI.Images {
		interface ImageGenerateParams {
			style_id: string;
		}
	}
}
/* eslint-enable @typescript-eslint/no-namespace */

const recraftAi = new OpenAI({
	apiKey: process.env.RECRAFT_API_TOKEN,
	baseURL: 'https://external.api.recraft.ai/v1',
});

export type ImageFocus = 'person' | 'object';

async function generatePromptFromTaskName(taskName: string, focus: ImageFocus): Promise<string> {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_TOKEN!);
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

	const prompt = {
		person: `
	You are an expert in crafting vivid, engaging image prompts. Your task is to transform a simple task name into 
    a rich, immersive image description that illustrates a person performing the task in an enjoyable and inviting way.
    
    - Clearly depict a person actively engaged in the task.
    - Unless the task explicitly specifies a different gender, assume the person is a man.
    - Emphasize body language and facial expressions that convey enjoyment, focus, or relaxation.
    - Describe the environment in a way that makes the scene feel pleasant, warm, or inspiring.
    - Keep the description under 1000 characters.
    
    Task: "${taskName}"
    
    Image Description:
    `,
		object: `
You are an expert in crafting vivid, engaging image prompts. Your task is to transform a simple task name into 
a rich, immersive image description that illustrates the primary object associated with the task in a visually appealing way.

- Focus on the central object related to the task rather than a person performing it.
- Highlight details that make the object visually interesting, such as texture, color, lighting, and any unique features.
- Place the object in an environment that enhances its aesthetic appeal and purpose (e.g., a vacuum in a clean, modern living room).
- Keep the description under 1000 characters.

Task: "${taskName}"

Image Description:
`,
	};

	const result = await model.generateContent(prompt[focus]);
	return result.response.text();
}

export async function generateImage(taskName: string, focus: ImageFocus): Promise<string> {
	try {
		const prompt = await generatePromptFromTaskName(taskName, focus);

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
