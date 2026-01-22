import { embeddingModel, supabase } from "./config.js";
import podcasts from "./content.js";

async function main(input) {
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

  //Insert into Supabase

  const { error } = await supabase.from("documents").insert(data);

  if (error) {
    console.error("Error inserting into Supabase:", error);
  } else {
    console.log("Embedding and insertion complete!");
  }
}

main(podcasts)