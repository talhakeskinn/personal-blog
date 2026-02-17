import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'tr'];

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Ensure that the incoming `locale` is valid
    if (!locale || !locales.includes(locale as any)) {
        notFound();
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
