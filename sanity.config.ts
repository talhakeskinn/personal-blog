'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool, defineLocations } from 'sanity/presentation'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/lib/api'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'


export default defineConfig({
  basePath: '/studio',
  studioUrl: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      resolve: {
        locations: {
          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
              language: 'language',
            },
            resolve: (doc: any) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/${doc?.language || 'tr'}/posts/${doc?.slug}`,
                },
                {
                  title: 'Ana Sayfa (TR)',
                  href: '/tr',
                },
                {
                  title: 'Home (EN)',
                  href: '/en',
                },
                {
                  title: 'Ana Sayfa (TR) - Blog',
                  href: '/tr/blog',
                },
                {
                  title: 'Home (EN) - Blog',
                  href: '/en/blog',
                },
              ],
            }),
          }),
        },
      },
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],
})
