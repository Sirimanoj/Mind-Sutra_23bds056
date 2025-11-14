
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

const UNPROTECTED_PATHS = ['/login'];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract locale from pathname
  const locale = pathname.split('/')[1];
  const pagePath = pathname.substring(locale.length + 1) || '/';

  const isUnprotected = UNPROTECTED_PATHS.some(path => pagePath.startsWith(path));

  useEffect(() => {
    // If loading, do nothing
    if (isUserLoading) return;
    
    // If not logged in and trying to access a protected page, redirect to login
    if (!user && !isUnprotected) {
      router.push(`/${locale}/login`);
    }

    // If logged in and trying to access an unprotected page (like login), redirect to dashboard
    if (user && isUnprotected) {
      router.push(`/${locale}/dashboard`);
    }
  }, [user, isUserLoading, router, pathname, isUnprotected, locale]);

  // While loading, show a full-screen skeleton loader
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    );
  }

  // If the route is unprotected, show it (e.g., the login page for a logged-out user)
  if (isUnprotected) {
    return <>{children}</>;
  }
  
  // If the user is logged in and the route is protected, show the content
  if(user) {
    return <>{children}</>;
  }

  // Otherwise, render nothing while redirecting
  return null;
}
