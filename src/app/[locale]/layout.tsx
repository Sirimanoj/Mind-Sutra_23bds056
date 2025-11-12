import React from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import AppLayout from '../(app)/layout';
 
type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {locale: string};
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // The locale is now correctly typed as string from params.locale
  const messages = await getMessages();
 
  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <AppLayout>
        {children}
      </AppLayout>
    </NextIntlClientProvider>
  );
}
