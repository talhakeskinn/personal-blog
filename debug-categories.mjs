
import { createClient } from 'next-sanity';

const client = createClient({
    projectId: '7uy8rf08',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkCategories() {
    try {
        const categories = await client.fetch(`
      *[_type == "category"] {
        title,
        language,
        "parentId": parent._ref
      }
    `);
        console.log('Categories:', JSON.stringify(categories, null, 2));
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

checkCategories();
