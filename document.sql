-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  content text, -- corresponds to the "text chunk"
  embedding vector(768) -- Changed from 1536 to 768 for Gemini
);

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  -- This calculates the "Cosine Similarity"
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;