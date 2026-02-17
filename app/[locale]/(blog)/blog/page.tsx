import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import BlogSidebar from "@/app/components/BlogSidebar";
import { findCategoryBySlug, collectCategoryIds, type Category } from "@/sanity/lib/utils";

// Tüm kategorileri çek (Sidebar için - hiyerarşik 5 seviye)
// sanity/lib/queries.ts içindeki categoryTreeQuery kullanılıyor
import { categoryTreeQuery } from "@/sanity/lib/queries";

// Postları çek (Filtreli veya Hepsi + Arama) - DİL FİLTRESİ EKLENDİ (Boş ise TR varsay)
const postsQuery = `*[_type == "post" && (language == $language || (!defined(language) && $language == 'tr')) &&
  ($categoryIds == null || count((categories[]->{_id})._id[@ in $categoryIds]) > 0 || references($categoryIds)) &&
  ($searchTerm == null || title match $searchTerm + "*" || body[].children[].text match $searchTerm + "*")
] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    "excerpt": summary,
    "imageUrl": mainImage.asset->url,
    "authorName": author->name
  }`;

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
    params: { locale: string };
}

import { getTranslations } from "next-intl/server";

export default async function BlogPage({ searchParams, params: { locale } }: PageProps) {
    const t = await getTranslations('BlogPage');
    const selectedCategorySlug = typeof searchParams.category === 'string' ? searchParams.category : null;
    const searchTerm = typeof searchParams.search === 'string' ? searchParams.search : null;

    // 1. Önce kategorileri çek (Hem sidebar için hem de filtreleme mantığı için gerekli)
    const categories = await sanityFetch<Category[]>({ query: categoryTreeQuery, params: { language: locale } });

    // 2. Seçili kategori varsa, onun ve alt kategorilerinin ID'lerini topla
    let categoryIds: string[] | null = null;
    if (selectedCategorySlug) {
        const selectedCategoryNode = findCategoryBySlug(categories, selectedCategorySlug);
        if (selectedCategoryNode) {
            categoryIds = collectCategoryIds(selectedCategoryNode);
        }
    }

    // 3. Postları bu ID listesine göre filtreleyerek çek
    const posts = await sanityFetch<any[]>({
        query: postsQuery,
        params: {
            categoryIds: categoryIds, // null ise hepsi gelir
            searchTerm: searchTerm ? `${searchTerm}*` : null,
            language: locale
        }
    });

    return (
        <div className="w-full pt-28 md:pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* LEFT SIDEBAR (1 Col) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <Suspense fallback={<div className="text-sm text-gray-500">{t('loading')}</div>}>
                                <BlogSidebar categories={categories} />
                            </Suspense>
                        </div>
                    </div>

                    {/* RIGHT CONTENT (3 Cols) */}
                    <div className="lg:col-span-3">
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {posts.map((post: any) => (
                                    <Link
                                        key={post._id}
                                        href={`/posts/${post.slug.current}`}
                                        className="group flex flex-col bg-white dark:bg-win11-card border border-black dark:border-white rounded-sm overflow-hidden h-full"
                                    >
                                        {/* Görsel */}
                                        <div
                                            className="relative w-full aspect-video bg-gray-100 dark:bg-win11-card overflow-hidden border-b border-black dark:border-white"
                                            style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}
                                        >
                                            {post.imageUrl ? (
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <span className="text-xs uppercase tracking-widest">{t('noImage')}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* İçerik */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
                                                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : t('noDate')}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-serif font-bold mb-3 leading-tight group-hover:underline underline-offset-4 decoration-1 text-black dark:text-white">
                                                {post.title}
                                            </h3>

                                            {post.excerpt && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase tracking-widest text-black dark:text-white group-hover:mr-2 transition-all">
                                                    {t('readMore')}
                                                </span>
                                                <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity text-black dark:text-white">→</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full py-20 bg-gray-50 dark:bg-win11-card border border-black dark:border-white rounded-sm flex flex-col items-center justify-center text-center p-8">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{t('noResults')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{t('noResultsDesc')}</p>
                                <Link
                                    href="/blog"
                                    className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest text-xs rounded-sm hover:opacity-80"
                                >
                                    {t('viewAll')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
