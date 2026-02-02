import { GoogleGenAI } from "@google/genai";
import { generateCodePrompt } from "./prompts/imageToCode";

export const generateCode = async (mimeType: string, base64ImageFile: Base64URLString) => {
	const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

	const contents = [
		{
			parts: [
				{
					inlineData: {
						mimeType: mimeType,
						data: base64ImageFile,
					},
				},
				{ text: generateCodePrompt },
			],
		},
	];

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: contents,
	});

	return response.text;
};
