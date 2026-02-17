import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from './api'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false for instant updates (live content)
  stega: {
    studioUrl: '/studio',
  },
})
