import Link from "next/link";
import { ReactNode } from "react";

interface SocialLink {
    label: string;
    href: string;
}

interface SocialWidgetProps {
    platform: string;
    links: SocialLink[];
    icon: ReactNode;
}

export default function SocialWidget({ platform, links, icon }: SocialWidgetProps) {
    return (
        <div className="relative w-full border border-black dark:border-white mb-12 bg-white dark:bg-win11-card group hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] rounded-sm overflow-hidden">

            {/* MANŞET TARZI ETİKET (SOL ÜST) */}
            <div className="absolute top-0 left-0 bg-white dark:bg-win11-card border-b border-r border-black dark:border-white px-4 py-2 z-10 flex items-center gap-2">
                <span className="text-base text-black dark:text-white">{icon}</span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black dark:text-white">{platform}</span>
            </div>

            {/* İÇERİK */}
            <div className="p-6 pt-12">
                <ul className="flex flex-col gap-3">
                    {links.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.href}
                                target="_blank"
                                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition-all duration-300 flex items-center gap-2"
                            >
                                <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></span>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
