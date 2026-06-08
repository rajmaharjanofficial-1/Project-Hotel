import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config(); // must be before using process.env

// Safety check
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const promptAI = async (promptMessage) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptMessage,
    });

    // ✅ Correct way to access text
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI generation error:", error.message);
    return "Error generating content";
  }
};

export default promptAI;
