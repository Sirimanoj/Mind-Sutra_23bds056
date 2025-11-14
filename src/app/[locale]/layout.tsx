
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';
import { Header } from '@/components/layout/header';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import AuthGate from '@/components/auth/auth-gate';
import { usePathname } from 'next/navigation';

type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <FirebaseClientProvider>
        <AuthGate>
          <SidebarProvider>
            <div className="flex">
              <MainNav />
              <div className="flex-1">
                <Header />
                <main className="p-4 md:p-6 lg:p-8">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </AuthGate>
      </FirebaseClientProvider>
    </NextIntlClientProvider>
  );
}
