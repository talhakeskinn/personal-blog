import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostCard from "@/app/components/PostCard";

import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryTreeQuery } from "@/sanity/lib/queries";

type CategoryNode = {
  _id: string;
  title: string;
  description?: string;
  slug?: { current?: string };
  children?: CategoryNode[];
};

const categoryPostsQuery = defineQuery(`
  *[_type == "post" && references($categoryIds)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    "plainBody": pt::text(body),
    "mainImage": mainImage.asset->url,
    "authorName": author->name
  }
`);

function findCategoryByPath(
  categories: CategoryNode[],
  slugs: string[],
) {
  if (slugs.length === 0) return null;

  let currentList = categories;
  const parents: CategoryNode[] = [];
  let current: CategoryNode | undefined;

  for (const slug of slugs) {
    current = currentList.find((cat) => cat.slug?.current === slug);
    if (!current) return null;
    parents.push(current);
    currentList = current.children || [];
  }

  return {
    category: current,
    parents: parents.slice(0, -1),
  };
}

function findCategoryBySlug(
  categories: CategoryNode[],
  slug: string,
): CategoryNode | null {
  for (const category of categories) {
    if (category.slug?.current === slug) return category;
    if (category.children?.length) {
      const match: CategoryNode | null = findCategoryBySlug(
        category.children,
        slug,
      );
      if (match) return match;
    }
  }
  return null;
}

function collectCategoryIds(category: CategoryNode): string[] {
  const ids = [category._id];
  if (category.children?.length) {
    category.children.forEach((child) => {
      ids.push(...collectCategoryIds(child));
    });
  }
  return ids;
}

async function getCategoryData(slug: string[]) {
  const categories = await sanityFetch<CategoryNode[]>({ query: categoryTreeQuery });
  const pathResult = findCategoryByPath(categories, slug);
  const category = pathResult?.category || findCategoryBySlug(categories, slug[0]);
  const parents = pathResult?.parents || [];

  return { category, parents };
}

function buildBreadcrumbItems(
  slug: string[],
  parents: CategoryNode[],
  category: CategoryNode,
) {
  const parentSlugs = parents
    .map((parent) => parent.slug?.current)
    .filter(Boolean) as string[];
  const currentSlug = category.slug?.current || slug[slug.length - 1];
  const segments = [...parentSlugs, currentSlug].filter(Boolean);

  return [
    {
      name: "Anasayfa",
      href: "/",
    },
    {
      name: category.title,
      href: `/kategori/${segments.join("/")}`,
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategoryData(slug);

  if (!category) {
    return {};
  }

  return {
    title: `${category.title} | Mint`,
    description:
      category.description ||
      "Bu kategorideki notlarimizi ve ogrenme adimlarini burada topluyoruz.",
    alternates: {
      canonical: `/kategori/${slug.join("/")}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const { category, parents } = await getCategoryData(slug);

  if (!category) {
    return notFound();
  }

  const categoryIds = collectCategoryIds(category);
  const posts = await sanityFetch({ query: categoryPostsQuery, params: { categoryIds } });
  const breadcrumbItems = buildBreadcrumbItems(slug, parents, category);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />



      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={{
              ...post,
              mainImage: post.mainImage // Query returns 'mainImage' here
            }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-gray-300 dark:text-gray-600 text-xs italic">
            Bu kategoride henüz yazı bulunmuyor.
          </div>
        </div>
      )}
    </div>
  );
}
