import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  "excerpt": coalesce(excerpt, pt::text(body)[0..160]),
  "coverImage": mainImage,
  "date": coalesce(publishedAt, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), "picture": image},
  "tags": tags,
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    "content": body,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    "content": body,
    ${postFields}
  }
`);

export const categoryTreeQuery = defineQuery(`
  *[_type == "category" && !defined(parent) && (language == $language || !defined(language))] {
    _id,
    title,
    slug,
    "children": *[_type == "category" && references(^._id) && (language == $language || !defined(language))] {
      _id,
      title,
      slug,
      "children": *[_type == "category" && references(^._id) && (language == $language || !defined(language))] {
        _id,
        title,
        slug,
        "children": *[_type == "category" && references(^._id) && (language == $language || !defined(language))] {
          _id,
          title,
          slug,
          "children": *[_type == "category" && references(^._id) && (language == $language || !defined(language))] {
            _id,
            title,
            slug
          }
        }
      }
    }
  }
`);
