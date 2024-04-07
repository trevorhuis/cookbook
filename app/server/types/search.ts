import { z } from "zod";

export const searchResultSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

export const SearchArraySchema = z.array(searchResultSchema);
