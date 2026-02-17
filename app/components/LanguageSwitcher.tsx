
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { useState, useTransition } from "react";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const switchLocale = (newLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    };

    return (
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <button
                disabled={isPending}
                onClick={() => switchLocale("tr")}
                className={`transition-colors ${locale === "tr"
                    ? "text-black dark:text-white underline underline-offset-4"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
            >
                TR
            </button>
            <span className="text-gray-300">|</span>
            <button
                disabled={isPending}
                onClick={() => switchLocale("en")}
                className={`transition-colors ${locale === "en"
                    ? "text-black dark:text-white underline underline-offset-4"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
            >
                EN
            </button>
        </div>
    );
}
