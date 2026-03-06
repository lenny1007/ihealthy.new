import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    // Type-check frontmatter using a schema
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
        category: z.string().optional(),
        /** 文章標籤，用於 SEO 與內容分類（例如 ['維生素C', '抗氧化', '補充品']） */
        tags: z.array(z.string()).optional(),
    }),
});

export const collections = { blog };
