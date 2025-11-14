
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';
import { Header } from '@/components/layout/header';
import AuthGate from '@/components/auth/auth-gate';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AuthGate>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <MainNav />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="p-4 md:p-6 lg:p-8 flex-1">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGate>
  );
}
