import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Source_Serif_4, Crimson_Pro, IBM_Plex_Sans } from "next/font/google"; // Fonts moved here
import "../globals.css"; // Adjusted path
import Script from "next/script";
import type { Metadata } from "next";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'tr' }];
}

export const metadata: Metadata = {
    title: {
        default: "Two Minds Blog | Teknoloji & Kültür",
        template: "%s | Two Minds Blog"
    },
    description: "Yazılım, teknoloji, kültür ve sanat üzerine iki farklı bakış açısı.",
    openGraph: {
        title: "Two Minds Blog",
        description: "Yazılım, teknoloji, kültür ve sanat üzerine iki farklı bakış açısı.",
        url: "https://twominds.blog",
        siteName: "Two Minds Blog",
        locale: "tr_TR",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
    verification: {
        google: "dpm8PkFJiCZd9EwiEZ6IDvYhtJn7rH4DhXMKfxxXcz0",
    },
};

// Fonts moved from old layout
const headingFont = Source_Serif_4({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
});

const bodyFont = Crimson_Pro({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
});

const uiFont = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-ui",
    display: "swap",
});

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages();

    return (
        <html lang={locale} className={`${headingFont.variable} ${bodyFont.variable} ${uiFont.variable}`}>
            <body className="antialiased bg-white dark:bg-win11-bg text-black dark:text-white font-serif min-h-screen flex flex-col transition-colors duration-300">
                {/* GA Scripts moved here */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-WSFTSCNQBZ"
                    strategy="lazyOnload"
                />
                <Script id="google-analytics" strategy="lazyOnload">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WSFTSCNQBZ');
          `}
                </Script>

                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </NextIntlClientProvider>
                {(await draftMode()).isEnabled && <VisualEditing />}
            </body>
        </html>
    );
}
