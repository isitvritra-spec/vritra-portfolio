import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        publishedDate: z.string(),
        category: z.enum(['.NET', 'AI', 'Performance', 'Architecture', 'Software Industry']),
        readTime: z.string().optional(),
        image: z.string().optional(),
        tags: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
    }),
});

const pages = defineCollection({
    type: 'content',
    schema: z.object({
        // SEO Metadata
        title: z.string(),
        description: z.string(),

        // Hero Section
        name: z.string(),
        role: z.string().optional(),
        heroDescription: z.string().optional(),
        tagline: z.string().optional(),
        intro: z.string().optional(),
        experience: z.string().optional(),

        // Skills (can be array of strings or array of objects)
        skills: z.union([
            z.array(z.string()),
            z.array(z.object({
                category: z.string(),
                items: z.array(z.string())
            }))
        ]).optional(),

        // Social Links
        social: z.array(z.object({
            platform: z.string(),
            url: z.string()
        })).optional(),

        // Email
        email: z.string().optional(),

        // Services
        services: z.array(z.object({
            title: z.string(),
            description: z.string(),
            featured: z.boolean(),
            icon: z.string()
        })).optional(),

        // Approach/Strengths Items
        approach: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string()
        })).optional(),

        strengths: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string()
        })).optional(),

        // Current Project
        currentProject: z.object({
            name: z.string(),
            client: z.string(),
            description: z.string(),
            progress: z.number(),
            phase: z.string(),
            timeline: z.string(),
            technologies: z.array(z.string())
        }).optional(),

        // Statistics
        stats: z.union([
            z.array(z.object({
                value: z.string(),
                label: z.string()
            })),
            z.array(z.object({
                value: z.number(),
                suffix: z.string(),
                label: z.string(),
                icon: z.string()
            }))
        ]).optional(),

        // Availability
        availability: z.object({
            status: z.string(),
            nextAvailable: z.string().optional(),
            date: z.string().optional()
        }).optional()
    }),
});

export const collections = { articles, pages };
