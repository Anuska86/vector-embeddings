import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

/** GeminiAI config */
if (!process.env.GEMINI_API_KEY)
  throw new Error("Gemini API key is missing or invalid.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

/** Supabase config */
const privateKey = process.env.SUPABASE_API_KEY;
const url = process.env.SUPABASE_URL;

export const supabase = createClient(url, privateKey);
