import { MetadataRoute } from 'next'
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://twominds.blog';

    // Fetch all posts
    const posts = await client.fetch(`*[_type == "post"] { 
        "slug": slug.current, 
        publishedAt 
    }`);

    // Fetch all categories
    const categories = await client.fetch(`*[_type == "category"] { 
        "slug": slug.current 
    }`);

    const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.publishedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category: any) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/hakkimizda`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        ...postEntries,
        ...categoryEntries,
    ];
}
