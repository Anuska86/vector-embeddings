import { embeddingModel, supabase } from "./config.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

//Chat Model

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function askQuestion(question) {
  const result = await embeddingModel.embedContent(question);
  const { data: documents } = await supabase.rpc("match_documents", {
    query_embedding: result.embedding.values,
    match_threshold: 0.1,
    match_count: 3,
  });

  //combine the text chunks

  const contextText = documents.map((doc) => doc.content).join("\n\n");

  const prompt = `You are a helpful assistant. Answer the user's question using ONLY the context provided below.
    If the answer isn't in the context, say "I don't have enough information."

    Context:
    ${contextText}

    User Question: ${question}`;

  const chatResult = await chatModel.generateContent(prompt);
  console.log("\nAI Answer:", chatResult.response.text());
}

askQuestion("What is the podcast about space called?");
