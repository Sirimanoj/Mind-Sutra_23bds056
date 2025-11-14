import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

// This is the root page of the app.
// It redirects the user to the default locale's login page.
export default function RootPage() {
  redirect(`/${defaultLocale}/login`);
}
