import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
 
const locales = ['en', 'hi'];
 
export default getRequestConfig(async ({locale}) => {
  if (!locale) {
    // This can happen during build time or if the locale is not in the path.
    // Default to 'en' or handle as needed. For now, we'll just notFound.
    notFound();
  }

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    locale, // This was missing
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
