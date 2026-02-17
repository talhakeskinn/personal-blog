
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
        _id,
        title,
        language,
        "parentId": parent._ref,
        "parentTitle": parent->title,
        "parentLanguage": parent->language
      }
    `);

        console.log('--- ALL CATEGORIES ---');
        categories.forEach(cat => {
            console.log(`Title: ${cat.title}`);
            console.log(`  Language: ${cat.language || 'null (TR)'}`);
            console.log(`  Parent: ${cat.parentTitle || 'None'} (Lang: ${cat.parentLanguage || 'null'})`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

checkCategories();
