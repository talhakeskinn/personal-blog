import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/fetch";

const authorPageQuery = defineQuery(`
  {
    "author": *[_type == "author" && slug.current == $slug][0] {
      name,
      "image": image.asset->url,
      "bioText": pt::text(bio)
    },
    "posts": *[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "plainBody": pt::text(body),
      "mainImage": mainImage.asset->url,
      "categories": categories[]->{"title": title, "slug": slug.current}
    }
  }
`);

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await sanityFetch({ query: authorPageQuery, params: { slug } });

  if (!data?.author) {
    return notFound();
  }

  const posts = data.posts || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center border-b pb-8">
        {data.author.image && (
          <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border border-gray-200 relative">
            <Image
              src={data.author.image ?? ""}
              alt={data.author.name || ""}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}
        <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">
          YAZAR
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900">
          {data.author.name}
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          {data.author.bioText ||
            "Bu sayfada yazarimizin notlarini ve ogrenme adimlarini topluyoruz."}
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => {
            const readingTime = post.plainBody
              ? Math.max(1, Math.ceil(post.plainBody.length / 1000))
              : null;

            return (
              <Link
                key={post._id}
                href={`/posts/${post.slug?.current}`}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  {post.mainImage ? (
                    <Image
                      src={post.mainImage ?? ""}
                      alt={post.title || ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                      Resim Yok
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    {post.categories?.[0]?.title && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        {post.categories[0].title}
                      </span>
                    )}
                    {readingTime ? <span>{readingTime} dk</span> : null}
                  </div>
                  {post.publishedAt && (
                    <p className="text-xs font-medium text-blue-600 mb-2">
                      {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {post.title || ""}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Henuz yazi yok
          </h3>
          <p className="mt-1 text-gray-500">
            Bu yazara ait icerik henuz paylasilmamis.
          </p>
        </div>
      )}
    </div>
  );
}
