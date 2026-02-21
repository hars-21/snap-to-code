import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "./prompts/imageToCode";

export const generateCode = async (
  mimeType: string,
  base64ImageFile: string,
  technology: string,
) => {
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
        {
          text: `Generate pixel-perfect UI code from the provided image using the specified technology. Technology: ${technology}`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return response.text;
};
