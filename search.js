import { embeddingModel, supabase } from "./config.js";

async function search(userQuery) {
  try {
    //Turn the question into an embedding
    const result = await embeddingModel.embedContent(userQuery);
    const queryEmbedding = result.embedding.values;

    //Call the Supabase function
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.1, //return good matches
      match_count: 5, //return the top 5
    });

    if (error) throw error;

    // Display the results
    console.log(`\nResults for: "${userQuery}"`);
    console.log("----------------------------");

    if (data.length === 0) {
      console.log("No relevant documents found.");
    } else {
      data.forEach((match, index) => {
        console.log(
          `${index + 1}. [Similarity: ${(match.similarity * 100).toFixed(2)}%]`,
        );
        console.log(`${match.content}\n`);
      });
    }
  } catch (err) {
    console.error("Search failed:", err.message);
  }
}

search("What is the main topic of the podcast?");
