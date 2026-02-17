import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { defineQuery, PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import { type Metadata, type ResolvingMetadata } from "next";

import { urlFor } from "@/sanity/lib/image";
import ReadingProgress from "@/app/components/ReadingProgress";
import LikeButton from "@/app/components/LikeButton";
import ViewCounter from "@/app/components/ViewCounter";

// --- YARDIMCI: YouTube ID Ayıklayıcı ---
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- İÇERİK BİLEŞENLERİ (Clean / Minimalist Style) ---
const ptComponents = {
  types: {
    // RESİM: Çerçevesiz, temiz, hafif yuvarlak köşe + Konumlandırma
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;

      const position = value.position || 'center';
      const size = value.size || 'full';

      // Boyut Sınıfları
      let sizeClass = 'w-full'; // Default full
      if (size === 'wide') sizeClass = 'w-full md:w-3/4';
      if (size === 'half') sizeClass = 'w-full md:w-1/2';
      if (size === 'small') sizeClass = 'w-full md:w-1/3';

      // Hizalama Sınıfları (Float mantığı ile metin sarmalaması için)
      let alignClass = 'mx-auto'; // Default center
      let containerClass = 'my-8 relative clear-both'; // Default block behavior

      if (position === 'left') {
        alignClass = 'float-left mr-6 mb-4';
        containerClass = 'relative inline-block'; // Inline-block for floats
      } else if (position === 'right') {
        alignClass = 'float-right ml-6 mb-4';
        containerClass = 'relative inline-block'; // Inline-block for floats
      } else {
        // Center
        alignClass = 'mx-auto';
        containerClass = 'my-12 w-full flex justify-center';
      }

      // Kombine Sınıflar
      const finalClassName = `${containerClass} ${sizeClass} ${alignClass}`;

      return (
        <figure className={finalClassName}>
          <div className="relative w-full h-auto rounded-sm overflow-hidden bg-gray-50 dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700">
            <Image
              src={urlFor(value).width(1200).fit("max").auto("format").url()}
              alt={value.alt || "Blog Gorseli"}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
              className="w-full h-auto object-contain"
            />
          </div>
          {value.alt && (
            <figcaption className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono tracking-wide italic">
              — {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
    // YOUTUBE: Sade Player
    youtube: ({ value }: any) => {
      const { url } = value;
      const id = getYouTubeId(url);
      if (!id) return null;
      return (
        <div className="my-12 w-full aspect-video bg-gray-100 dark:bg-zinc-800 rounded-sm overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      );
    },
  },
  // YAZI TİPOGRAFİSİ: Akademik ve Okunaklı
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-4xl font-display font-semibold text-black dark:text-white mt-16 mb-6 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-display font-medium text-black dark:text-white mt-10 mb-4">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-6 text-black dark:text-white text-xl leading-8 font-light antialiased">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-blue-600 pl-6 my-10 italic text-xl text-black dark:text-white bg-gray-50/50 dark:bg-win11-card/50 py-4">
        &ldquo;{children}&rdquo;
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          className="text-blue-600 dark:text-blue-400 font-medium underline decoration-1 underline-offset-4 hover:decoration-2 transition-all"
        >
          {children}
        </a>
      )
    },
    code: ({ children }: any) => (
      <code className="bg-gray-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  }
};

// --- VERİ SORGUSU ---
const singlePostQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug && (language == $language || (!defined(language) && $language == 'tr'))][0] {
    title,
    body,
    publishedAt,
    excerpt,
    mainImage,

    views,
    views,
    tags,
    "authorName": author->name
  }
`);

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; locale: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await sanityFetch({ query: singlePostQuery, params: { slug, language: locale } });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : previousImages[0];

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [ogImage, ...previousImages],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.authorName],
      tags: post.tags,
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://twominds.blog/posts/${slug}`,
    },
  };
}


export default async function PostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  // Cache'i devre dışı bırakarak en güncel veriyi çekiyoruz
  const post = await sanityFetch({ query: singlePostQuery, params: { slug, language: locale } });

  if (!post) notFound();

  // Güvenli görsel verisi oluşturma - Sanity v3
  // urlFor fonksiyonu asset referansını veya image objesini alıp URL üretir
  let mainImageUrl = null;
  if (post.mainImage) {
    try {
      mainImageUrl = urlFor(post.mainImage).width(1200).auto('format').url();
    } catch (e) {
      console.error("Image URL generation failed:", e);
    }
  }

  const imgAlt = post.mainImage?.alt || post.title || "Blog Görseli";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: mainImageUrl || undefined,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.authorName,
    },
    url: `https://twominds.blog/posts/${slug}`,
  };

  return (
    <article className="min-h-screen bg-white dark:bg-win11-bg pb-20 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Okuma İlerleme Çubuğu */}

      <ReadingProgress />

      {/* 1. HEADER ALANI (Başlık ve Meta) */}
      <header className="max-w-4xl mx-auto px-6 pt-40 pb-12 text-center">

        {/* Tarih ve Yazar */}
        <div className="flex items-center justify-center gap-3 text-sm font-bold font-mono uppercase tracking-widest text-black dark:text-white mb-6">
          <span>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("tr-TR")
              : ""}
          </span>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-500 dark:text-gray-400">{post.authorName || "Talha Keskin"}</span>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <LikeButton id={post._id} initialLikes={post.likes} className="scale-90" />
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <ViewCounter postId={post._id} initialViews={post.views} />
        </div>

        {/* Başlık */}
        <h1 className="text-lg md:text-2xl font-display font-medium text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
          {post.title}
        </h1>

        {/* Kısa Özet (Lead Text) */}
        {post.excerpt && (
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mb-8">
            {post.excerpt}
          </p>
        )}


      </header>

      {/* 2. ANA GÖRSEL (Geniş ama kontrollü - Kırpılmadan) */}
      {mainImageUrl ? (
        <div className="max-w-3xl mx-auto px-6 mb-12">
          <div className="w-full overflow-hidden rounded-sm bg-gray-100 dark:bg-zinc-800 relative shadow-sm border border-gray-100 dark:border-zinc-700">
            <Image
              src={mainImageUrl}
              alt={imgAlt}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      ) : (
        /* DEBUG FALLBACK: Eğer görsel verisi var ama URL oluşmadıysa veya yoksa */
        <div className="hidden">No Image Available</div>
      )}

      {/* 3. İÇERİK GÖVDESİ */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-body">
          <PortableText value={post.body ?? []} components={ptComponents} />
        </div>

        {/* Bitiş İmzası */}
        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-white flex justify-between items-center text-sm font-mono text-gray-400 dark:text-gray-500">
          <span>END OF FILE</span>
          <span>Talha Keskin // Blog</span>
        </div>
      </div>

    </article>
  );
}
