
"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";

interface Category {
    title: string;
    slug: { current: string };
}

interface NavbarProps {
    categories?: Category[];
}

import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ categories = [] }: NavbarProps) {
    const t = useTranslations('Navbar');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Scroll durumunu takip et
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Menü öğeleri - Galeri en sağda
    const allMenuItems = [
        { name: t('home'), href: "/" },
        { name: t('blog'), href: "/blog" },
        { name: t('about'), href: "/#hakkimizda" },
        { name: t('contact'), href: "/#iletisim" },
        { name: t('gallery'), href: "/galeri" },
    ];

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-[999] bg-white dark:bg-win11-bg border-b border-black dark:border-white transition-all duration-300 ${isScrolled ? "h-16" : "h-24"}`}>
                {/* Navbar Re-aligned to 3-Column Grid */}
                {/* Navbar Container - Aligned with Main Content (max-w-6xl) */}
                <div className="w-full h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                    {/* LOGO */}
                    <Link href="/" className="flex flex-col relative z-50">
                        <div className="text-center leading-none">
                            <div className={`font-sans font-light tracking-[-0.05em] leading-[0.9] text-black dark:text-white transition-all duration-300 ${isScrolled ? "text-xl" : "text-2xl"}`}>TWO MINDS</div>
                            <div className={`font-sans uppercase tracking-[0.4em] text-gray-400 ml-1 mt-1 transition-all duration-300 ${isScrolled ? "text-xs" : "text-sm"}`}>Blog</div>
                        </div>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {allMenuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm lg:text-base font-sans uppercase tracking-[-0.05em] leading-[0.9] transition-all duration-300 text-gray-400 hover:text-black dark:text-gray-300 dark:hover:text-white font-light"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </nav>

                    {/* RIGHT SIDE: MOBILE MENU TOGGLE */}
                    <div className="md:hidden flex items-center gap-4">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-black dark:text-white transition-opacity duration-500"
                        >
                            <div className="w-6 flex flex-col items-end gap-[5px]">
                                <span className={`h-[2px] bg-black dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`}></span>
                                <span className={`h-[2px] bg-black dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "w-4"}`}></span>
                                <span className={`h-[2px] bg-black dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5"}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* SPACER for fixed header */}
            {/* The header is h-24 (96px). Pages have pt-72 (288px) currently so they might have too much space now. We might need to adjust page padding later, but leaving for now as user asked for space. */}

            {/* MOBİL MENÜ İÇERİĞİ */}
            <div
                className={`fixed inset-0 bg-white dark:bg-win11-bg z-[990] flex flex-col items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                <ul className="flex flex-col items-center gap-8 text-center">
                    {allMenuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-xl font-sans tracking-widest uppercase ${pathname === item.href ? "text-black dark:text-white underline underline-offset-8" : "text-gray-600 dark:text-white"}`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobil Kategoriler */}
                {categories.length > 0 && (pathname === '/blog' || pathname.startsWith('/category') || pathname.startsWith('/posts')) && (
                    <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-xs">
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug.current}
                                href={`/category/${cat.slug.current}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xs uppercase tracking-wider text-gray-400"
                            >
                                {cat.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}