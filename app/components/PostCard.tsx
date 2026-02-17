
import Link from "next/link";
import Image from "next/image";
import LikeButton from "./LikeButton";
import { urlFor } from "@/sanity/lib/image";

interface PostCardProps {
    post: {
        _id: string;
        title: string;
        slug: { current: string };
        publishedAt: string;
        excerpt: string;
        mainImage?: any;
        authorName?: string;
        likes?: number; // Yeni alan
    };
}

export default function PostCard({ post }: PostCardProps) {
    // Simple reading time estimation: 200 words per minute
    const readingTime = post.excerpt
        ? Math.max(1, Math.ceil(post.excerpt.split(" ").length / 200 * 5))
        : 1;

    return (
        <div className="relative group flex flex-col h-full bg-white dark:bg-win11-card rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-white">
            {/* TIKLANABİLİR KATMAN (Overlay Link) */}
            <Link href={`/posts/${post.slug.current}`} className="absolute inset-0 z-20" aria-label={post.title} />

            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-win11-card">
                {post.mainImage ? (
                    <Image
                        src={urlFor(post.mainImage).width(800).height(500).url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 dark:bg-win11-card">
                        <span className="text-xs uppercase tracking-widest">Resim Yok</span>
                    </div>
                )}

                {/* Overlay Date Label */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-win11-bg/90 backdrop-blur-sm px-3 py-1 text-sm font-bold uppercase tracking-widest text-black dark:text-white shadow-sm z-10 pointer-events-none">
                    {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 relative">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    {post.authorName && (
                        <>
                            <span className="text-blue-600 dark:text-blue-400">{post.authorName}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        </>
                    )}
                    <span>{readingTime} dk okuma</span>
                </div>

                <h3 className="text-2xl font-serif text-black dark:text-white leading-tight mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 text-justify mb-4">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-white flex items-center justify-between">
                    <div className="text-sm font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center">
                        Devamını Oku
                        <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                    </div>

                    {/* Like Button - Z-Index ile Linkin üstünde */}
                    <LikeButton id={post._id} initialLikes={post.likes} className="relative z-30" />
                </div>
            </div>
        </div>
    );
}
