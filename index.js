import { embeddingModel, supabase } from "./config.js";
import podcasts from "./content.js";

async function main(input) {
  try {
    const data = await Promise.all(
      input.map(async (textChunk) => {
        const result = await embeddingModel.embedContent(textChunk);
        const embedding = result.embedding.values;

        return {
          content: textChunk,
          embedding: embedding,
        };
      }),
    );

    const { error } = await supabase.from("documents").insert(data);

    if (error) throw error;

    console.log("Success!");
  } catch (error) {
    console.error("Critical Error:", error.message);
  }
}

main(podcasts);
