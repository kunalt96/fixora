import { GoogleGenerativeAI } from '@google/generative-ai';

export const analyZeERROR = async ({ message, stack }) => {
  if (!process.env.GEMINI_API_KEY) {
    return {
      explanation: `(Mock) This error occurs because ${message}. Please set GEMINI_API_KEY in .env`,
      fix: "Add GEMINI_API_KEY to your .env file to enable real AI generation.",
      confidence: "Low"
    };
  }
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
      You are an expert software engineer.
      Analyze the following error:
      Message: ${message}
      Stack: ${stack || 'No stack trace available'}
      Be specific. Give code-level fix.

      Please provide your response in valid JSON format with exactly three fields:
      - "explanation": A brief explanation of why this error occurs.
      - "fix": A clear, short suggestion on how to fix it.
      - "confidence": "High", "Medium", or "Low"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      explanation: `An error occurred while calling the AI: ${error.message}`,
      fix: "Check the server logs or verify your API key.",
      confidence: "Low"
    };
  }
};
