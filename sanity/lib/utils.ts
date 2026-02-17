import createImageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/lib/api";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: any) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto("format").fit("max");
};

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
  if (!image) return;
  const url = urlForImage(image)?.width(1200).height(627).fit("crop").url();
  if (!url) return;
  return { url, alt: image?.alt as string, width, height };
}

export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case "post":
      return slug ? `/posts/${slug}` : undefined;
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}
// --- RECURSIVE CATEGORY HELPERS ---

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  children?: Category[];
}

export function collectCategoryIds(category: Category): string[] {
  const ids = [category._id];
  if (category.children?.length) {
    category.children.forEach((child) => {
      ids.push(...collectCategoryIds(child));
    });
  }
  return ids;
}

export function findCategoryBySlug(
  categories: Category[],
  slug: string,
): Category | null {
  for (const category of categories) {
    if (category.slug?.current === slug) return category;
    if (category.children?.length) {
      const match: Category | null = findCategoryBySlug(
        category.children,
        slug,
      );
      if (match) return match;
    }
  }
  return null;
}
