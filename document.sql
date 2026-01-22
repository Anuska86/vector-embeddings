-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  content text, -- corresponds to the "text chunk"
  embedding vector(768) -- Changed from 1536 to 768 for Gemini
);