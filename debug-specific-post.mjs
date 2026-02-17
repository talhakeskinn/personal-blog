
import { createClient } from 'next-sanity';
import fs from 'fs';

const client = createClient({
    projectId: '7uy8rf08',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function checkLatestPost() {
    try {
        const post = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc)[0] {
        _id,
        title,
        language,
        "authorRef": author._ref,
        "resolvedAuthorName": author->name
      }
    `);

        let output = { post };

        if (post && post.authorRef) {
            const authorDoc = await client.fetch(`*[_id == $id][0]`, { id: post.authorRef });
            output.authorDoc = authorDoc;
        }

        fs.writeFileSync('debug-output.json', JSON.stringify(output, null, 2));
        console.log('Written to debug-output.json');

    } catch (error) {
        console.error('Error:', error);
        fs.writeFileSync('debug-output.json', JSON.stringify({ error: error.message }, null, 2));
    }
}

checkLatestPost();
