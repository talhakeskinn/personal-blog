import Link from "next/link";
import { ReactNode } from "react";

interface SocialLink {
    platform: string;
    icon: ReactNode;
    href: string;
}

interface AuthorCardProps {
    name: string;
    socialLinks: SocialLink[];
}

export default function AuthorCard({ name, socialLinks }: AuthorCardProps) {
    return (
        <div className="relative w-full border border-black dark:border-white mb-12 bg-white dark:bg-win11-card rounded-sm overflow-hidden">

            {/* YAZAR ADI ETİKETİ */}
            <div className="absolute top-0 left-0 bg-white dark:bg-win11-card border-b border-r border-black dark:border-white px-4 py-2 z-10">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black dark:text-white">YAZAR</span>
            </div>

            {/* İÇERİK */}
            <div className="p-6 pt-12 flex flex-col gap-4">
                {/* Yazar İsmi */}
                <h3 className="font-serif font-bold text-lg leading-tight text-black dark:text-white">{name}</h3>

                {/* Sosyal Medya İkonları */}
                <div className="flex items-center gap-4">
                    {socialLinks.map((link) => (
                        <Link
                            key={link.platform}
                            href={link.href}
                            target="_blank"
                            className="text-xl text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all duration-300"
                            title={link.platform}
                        >
                            {link.icon}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
