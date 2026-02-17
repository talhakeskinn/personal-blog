import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import LikeButton from "@/app/components/LikeButton";
import { urlFor } from "@/sanity/lib/image";
import { getTranslations } from "next-intl/server";

// Manşet kartı için sorgu - sadece isHeadline: true olanlar ve seçili dilde (veya dili yoksa TR kabul et)
const headlineQuery = `*[_type == "post" && isHeadline == true && (language == $language || (!defined(language) && $language == 'tr'))] | order(publishedAt desc)[0] {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": summary,
  mainImage,
  "authorName": author->name,
  likes
}`;

// Son postlar için sorgu - isHeadline: false olanlar ve seçili dilde (veya dili yoksa TR kabul et)
const latestPostsQuery = `*[_type == "post" && isHeadline != true && (language == $language || (!defined(language) && $language == 'tr'))] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  "excerpt": summary,
  mainImage,
  "authorName": author->name,
  likes
}`;

interface Post {
    _id: string;
    title: string;
    slug: { current: string };
    publishedAt: string;
    excerpt: string;
    mainImage?: any;
    authorName?: string;
    likes?: number;
}

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations('Home');
    // Manşet kartı için ayrı fetch
    const heroMain: Post | null = await sanityFetch({ query: headlineQuery, params: { language: locale } });

    // Son postlar için ayrı fetch
    const latestPosts: Post[] = await sanityFetch({ query: latestPostsQuery, params: { language: locale } });

    const heroPlaceholder: Post = {
        _id: "placeholder",
        title: "Henüz Manşet Seçilmedi",
        slug: { current: "#" },
        publishedAt: new Date().toISOString(),
        excerpt: "Sanity Studio'dan bir yazıyı 'Manşet Kartı' olarak işaretleyin. Bu yazı burada büyük kart olarak görünecektir.",
        mainImage: undefined,
        authorName: "Sistem",
        likes: 0,
    };

    const headline = heroMain || heroPlaceholder;

    return (
        <div className="w-full pt-28 md:pt-40 pb-24 px-4 sm:px-6 lg:px-12">

            {/* MANŞET KARTI */}
            {headline && (
                <div className="relative w-full border border-black dark:border-white group cursor-pointer h-auto overflow-hidden rounded-sm">
                    {/* TIKLANABİLİR KATMAN (Overlay Link) */}
                    <Link href={`/posts/${headline.slug.current}`} className="absolute inset-0 z-20" aria-label={headline.title} />

                    {/* MANŞET ETİKETİ */}
                    <div className="absolute top-0 left-0 bg-white dark:bg-win11-bg px-4 border-b border-r border-black dark:border-white z-10 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white rounded-br-sm pointer-events-none">
                        {t('headline')}
                    </div>

                    <div className="flex flex-col h-full">
                        {/* Görsel Tarafı - Saydam Yükseklik (Doğal Boyut) -> Aspect Ratio Eklendi */}
                        <div className="w-full aspect-video bg-gray-100 dark:bg-win11-card border-b border-black dark:border-white relative overflow-hidden">
                            {headline.mainImage ? (
                                <Image
                                    src={urlFor(headline.mainImage).width(1280).height(720).url()}
                                    alt={headline.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 100vw"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-[400px] flex items-center justify-center text-gray-400">{t('noImage')}</div>
                            )}
                        </div>

                        {/* İçerik Tarafı - Altta, Kompakt Akış */}
                        <div className="w-full p-4 sm:p-5 lg:p-6 flex flex-col justify-between bg-white dark:bg-win11-card">
                            <div className="flex flex-col">
                                {/* Tarih */}
                                <div className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                    {new Date(headline.publishedAt).toLocaleDateString('tr-TR')}
                                </div>

                                {/* Başlık - Kompakt */}
                                <h2 className="font-serif font-bold leading-[1.1] mb-2 group-hover:underline decoration-1 underline-offset-4 text-xl md:text-2xl lg:text-3xl text-black dark:text-white">
                                    {headline.title}
                                </h2>

                                {/* Özet */}
                                <p className="text-gray-600 dark:text-white leading-relaxed text-sm md:text-base line-clamp-2 md:line-clamp-3">
                                    {headline.excerpt}
                                </p>
                            </div>

                            {/* Devamını Oku Alt Kısım */}
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-black dark:text-white">
                                <span>{t('readMore')}</span>
                                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SON İKİ YAZI - 2 Kolonlu Grid */}
            {latestPosts.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {latestPosts.slice(0, 2).map((post, index) => (
                        <div
                            key={post._id}
                            className="relative group flex flex-col bg-white dark:bg-win11-card border border-black dark:border-white rounded-sm overflow-hidden"
                        >
                            <Link href={`/posts/${post.slug.current}`} className="absolute inset-0 z-20" aria-label={post.title} />

                            {/* Görsel */}
                            <div className="relative w-full aspect-video h-auto bg-gray-100 dark:bg-win11-card overflow-hidden">
                                {post.mainImage ? (
                                    <Image
                                        src={urlFor(post.mainImage).width(800).height(450).url()}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">{t('noImage')}</div>
                                )}
                            </div>

                            {/* İçerik */}
                            <div className="p-6 flex flex-col gap-2 border-t border-black dark:border-white flex-1">
                                <span className="text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                                    {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                                </span>
                                <h3 className="font-serif font-bold text-lg leading-tight group-hover:underline decoration-1 underline-offset-4 text-black dark:text-white">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{post.excerpt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* HAKKIMIZDA BÖLÜMÜ */}
            <section
                id="hakkimizda"
                className="mt-16 pt-16 border-t border-black dark:border-white min-h-screen flex flex-col justify-center"
            >
                <div className="max-w-4xl mx-auto w-full">

                    {/* Başlık */}
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4 block">{t('whoWeAre')}</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white">{t('aboutTitle')}</h2>
                    </div>

                    {/* İki Yazar Kartı */}
                    <div className="grid md:grid-cols-2 gap-12 mb-16">

                        {/* Talha Keskin */}
                        <div className="flex flex-col items-center text-center p-8 border border-black dark:border-white rounded-sm">
                            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-win11-card flex items-center justify-center text-4xl mb-6 border border-black dark:border-white">
                                👨‍💻
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-2 text-black dark:text-white">Talha Keskin</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Yazar</p>
                            <p className="text-gray-600 dark:text-white leading-relaxed text-sm">
                                Yazar
                            </p>
                        </div>

                        {/* Mina Gören */}
                        <div className="flex flex-col items-center text-center p-8 border border-black dark:border-white rounded-sm">
                            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-win11-card flex items-center justify-center text-4xl mb-6 border border-black dark:border-white">
                                👩‍💻
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-2 text-black dark:text-white">Mina Gören</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Yazar</p>
                            <p className="text-gray-600 dark:text-white leading-relaxed text-sm">
                                Yazar
                            </p>
                        </div>

                    </div>

                    {/* Alt Açıklama */}
                    <div className="text-center border-t border-black/20 dark:border-white/20 pt-12">
                        <p className="text-lg text-gray-600 dark:text-white max-w-2xl mx-auto leading-relaxed">
                            <span className="font-serif italic text-2xl text-black dark:text-white">&quot;Two Minds&quot;</span> — İki farklı bakış açısı,
                            ortak bir platform. Teknoloji, kültür ve yaratıcılığın kesiştiği noktada buluşuyoruz.
                        </p>
                    </div>

                </div>
            </section>

            {/* İLETİŞİM BÖLÜMÜ */}
            <section
                id="iletisim"
                className="mt-16 pt-16 border-t border-black dark:border-white min-h-screen flex flex-col justify-center"
            >
                <div className="max-w-4xl mx-auto w-full">

                    {/* Başlık */}
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4 block">{t('reachUs')}</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white">{t('contactTitle')}</h2>
                    </div>

                    {/* İletişim Bilgileri Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">

                        {/* Email */}
                        <div className="flex flex-col items-center text-center p-8 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group rounded-sm">
                            <div className="text-4xl mb-4">✉️</div>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-2 text-black dark:text-white group-hover:text-white dark:group-hover:text-black">Email</h3>
                            <a href="mailto:info@twominds.blog" className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 dark:group-hover:text-gray-600 hover:underline">
                                info@twominds.blog
                            </a>
                        </div>

                        {/* Konum */}
                        <div className="flex flex-col items-center text-center p-8 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group rounded-sm">
                            <div className="text-4xl mb-4">📍</div>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-2 text-black dark:text-white group-hover:text-white dark:group-hover:text-black">Konum</h3>
                            <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 dark:group-hover:text-gray-600">
                                İstanbul, Türkiye
                            </p>
                        </div>

                        {/* Sosyal Medya */}
                        <div className="flex flex-col items-center text-center p-8 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group rounded-sm">
                            <div className="text-4xl mb-4">🔗</div>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-2 text-black dark:text-white group-hover:text-white dark:group-hover:text-black">Sosyal</h3>
                            <div className="flex gap-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-300 dark:group-hover:text-gray-600">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                            </div>
                        </div>

                    </div>

                    {/* Mesaj Formu */}
                    <div className="border border-black dark:border-white p-8 md:p-12 rounded-sm">
                        <h3 className="text-2xl font-serif font-bold mb-8 text-center text-black dark:text-white">{t('sendMessage')}</h3>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    placeholder="Adınız"
                                    className="w-full px-4 py-3 border border-black dark:border-white bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:bg-gray-50 dark:focus:bg-zinc-800 transition-colors rounded-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Adresiniz"
                                    className="w-full px-4 py-3 border border-black dark:border-white bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:bg-gray-50 dark:focus:bg-zinc-800 transition-colors rounded-sm"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Konu"
                                className="w-full px-4 py-3 border border-black dark:border-white bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:bg-gray-50 dark:focus:bg-zinc-800 transition-colors rounded-sm"
                            />
                            <textarea
                                placeholder="Mesajınız"
                                rows={5}
                                className="w-full px-4 py-3 border border-black dark:border-white bg-transparent text-black dark:text-white placeholder-gray-500 focus:outline-none focus:bg-gray-50 dark:focus:bg-zinc-800 transition-colors resize-none rounded-sm"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-sm"
                            >
                                {t('send')} →
                            </button>
                        </form>
                    </div>

                </div>
            </section>

        </div>
    );
}