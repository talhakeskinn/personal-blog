
import Navbar from "@/app/components/Navbar";
import { client } from "@/sanity/lib/client";
import AlertBanner from "./alert-banner";
import { draftMode } from "next/headers";

// Fetch top-level categories (no parent)
// Fetch top-level categories (no parent) and filter by language (null shows everywhere)
const categoriesQuery = `*[_type == "category" && !defined(parent) && (language == $language || !defined(language))] {
    title,
    slug
}`;

export default async function BlogLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const categories = await client.fetch(categoriesQuery, { language: locale });
  return (
    <>
      {(await draftMode()).isEnabled && <AlertBanner />}
      <Navbar categories={categories} />

      {/* Ana İçerik - Tam Genişlik */}
      <div className="flex-grow w-full flex flex-col">
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="w-full py-8 mt-16 border-t border-black/10 dark:border-white/10 bg-white dark:bg-win11-bg">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs tracking-widest uppercase text-gray-400 font-sans">
            <p>© {new Date().getFullYear()} Two Minds</p>
            <div className="flex items-center gap-4 md:gap-6">
              <p>Developed by Talha Keskin & Mina Gören</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}