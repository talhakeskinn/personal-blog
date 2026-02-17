
import { createClient } from 'next-sanity';

const client = createClient({
    projectId: '7uy8rf08',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkAuthors() {
    try {
        console.log("Fetching Posts and Authors...");
        const posts = await client.fetch(`
      *[_type == "post"] {
        title,
        language,
        "authorRef": author._ref,
        "authorName": author->name
      }
    `);

        console.log('--- POST AUTHORS ---');
        posts.forEach(post => {
            console.log(`Post: ${post.title} (${post.language || 'null'})`);
            console.log(`  Author Ref: ${post.authorRef || 'NONE'}`);
            console.log(`  Resolved Name: ${post.authorName || 'NULL (Fallback triggers here)'}`);
            console.log('---');
        });

        const authors = await client.fetch(`*[_type == "author"] { _id, name }`);
        console.log('--- ALL AUTHORS IN DATASET ---');
        console.log(JSON.stringify(authors, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

checkAuthors();
