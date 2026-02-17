"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SearchWidget from "./SearchWidget";
import { IoFolderOpenOutline, IoFolderOutline, IoReturnDownForward, IoAlbumsOutline } from "react-icons/io5";

// Recursive Type Definition
interface Category {
    _id: string;
    title: string;
    slug: { current: string };
    children?: Category[];
}

interface BlogSidebarProps {
    categories: Category[];
}

// Recursive Component for Category Items
const CategoryItem = ({ category, level = 0, activeCategory }: { category: Category, level?: number, activeCategory: string | null }) => {
    const isActive = activeCategory === category.slug.current;

    // Check if any descendant is active (to verify if we should expand)
    // This is a simple deep check function
    const hasActiveChild = (cat: Category): boolean => {
        if (cat.slug.current === activeCategory) return true;
        return cat.children ? cat.children.some(hasActiveChild) : false;
    };

    const isExpanded = isActive || (category.children && category.children.some(hasActiveChild));

    // Dynamic Styles based on level
    const paddingLeft = level === 0 ? "px-4" : level === 1 ? "pl-8 pr-4" : level === 2 ? "pl-12 pr-4" : "pl-16 pr-4";
    const fontSize = level === 0 ? "text-lg" : "text-base";
    const iconSize = level === 0 ? "text-xl" : "text-sm";

    return (
        <div className="flex flex-col">
            <Link
                href={`/blog?category=${category.slug.current}`}
                className={`${paddingLeft} py-3 ${fontSize} rounded-sm transition-colors flex items-center gap-3 ${isActive
                    ? "bg-black text-white dark:bg-white dark:text-black font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
            >
                {/* Level 0 uses Folder icons, deeper levels use Arrows */}
                {level === 0 ? (
                    isActive ? <IoFolderOpenOutline className={iconSize} /> : <IoFolderOutline className={iconSize} />
                ) : (
                    <IoReturnDownForward className={`${iconSize} ${isActive ? "opacity-100" : "opacity-30"}`} />
                )}

                {category.title}
            </Link>

            {/* Recursive Children Rendering */}
            {category.children && category.children.length > 0 && (
                <div className={`flex flex-col border-l border-gray-200 dark:border-gray-700 ml-4 mt-1 mb-1 ${(isExpanded) ? 'block' : 'hidden'}`}>
                    {category.children.map((child) => (
                        <CategoryItem
                            key={child._id}
                            category={child}
                            level={level + 1}
                            activeCategory={activeCategory}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

import { useTranslations } from "next-intl";

export default function BlogSidebar({ categories }: BlogSidebarProps) {
    const t = useTranslations('BlogSidebar');
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category");

    return (
        <aside className="w-full">
            <SearchWidget />

            <h3 className="text-sm font-bold tracking-widest uppercase border-b border-black dark:border-white pb-4 mb-6 text-black dark:text-white">
                {t('filter')}
            </h3>

            <div className="flex flex-col gap-1">
                <Link
                    href="/blog"
                    className={`px-4 py-3 text-lg rounded-sm transition-colors flex items-center gap-3 ${!activeCategory
                        ? "bg-black text-white dark:bg-white dark:text-black font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        }`}
                >
                    <IoAlbumsOutline className="text-xl" />
                    {t('allPosts')}
                </Link>

                {categories.map((category) => (
                    <CategoryItem
                        key={category._id}
                        category={category}
                        activeCategory={activeCategory}
                    />
                ))}
            </div>
        </aside>
    );
}
