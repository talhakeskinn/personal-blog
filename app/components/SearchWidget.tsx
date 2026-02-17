"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";

import { useTranslations } from "next-intl";

export default function SearchWidget() {
    const t = useTranslations('BlogSidebar');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);

        if (searchTerm.trim()) {
            params.set("search", searchTerm.trim());
        } else {
            params.delete("search");
        }

        // Kategori filtresini koru, ancak sayfa 1'e dön (pagination varsa)
        // Şu an sadece search ve category params var.

        router.push(`/blog?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full mb-8">
            <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-win11-card border border-black dark:border-white rounded-sm text-sm text-black dark:text-white placeholder-gray-500 focus:outline-none focus:bg-gray-50 dark:focus:bg-zinc-800 transition-colors"
                aria-label="Search"
            />
            <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-tr-sm rounded-br-sm flex items-center justify-center"
                aria-label="Submit Search"
            >
                <IoSearch className="w-5 h-5" />
            </button>
        </form>
    );
}
