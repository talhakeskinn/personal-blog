
import { createClient } from 'next-sanity';

const client = createClient({
    projectId: '7uy8rf08',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkContent() {
    try {
        const posts = await client.fetch('*[_type == "post"]{_id, title, language}');
        console.log('Posts:', JSON.stringify(posts, null, 2));
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

checkContent();
