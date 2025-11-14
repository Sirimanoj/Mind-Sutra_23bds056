
import { AuthForm } from '@/components/auth/auth-form';
import { getTranslations } from 'next-intl/server';
import { HeartPulse } from 'lucide-react';
import LanguageSwitcher from '@/components/layout/language-switcher';

export default async function LoginPage() {
  const t = await getTranslations('Auth');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
            <div className='flex justify-center items-center gap-2 mb-4'>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <HeartPulse className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="font-headline text-3xl font-bold">MannMitra</h1>
            </div>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
