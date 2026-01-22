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

async function search(userQuery) {
  //Turn the question into an embedding

  const result = await embeddingModel.embedContent(userQuery);
  const queryEmbedding = result.embedding.values;

  //Call the Supabase function

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5, //return good matches
    match_count: 5, //return the top 5
  });

  if (error) {
    console.error(error);
    console.log("Search Results:", data);
  }
}

//main(podcasts);
search(userQuery);
