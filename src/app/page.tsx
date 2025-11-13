
import { redirect } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n/request';

// This is the root page of the app.
// It redirects the user to the default locale's dashboard.
export default function RootPage() {
  redirect(`/${defaultLocale}/dashboard`);
}
