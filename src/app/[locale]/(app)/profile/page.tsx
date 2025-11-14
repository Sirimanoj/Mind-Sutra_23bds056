
'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to login page after successful sign-out
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      // Optionally, show an error toast to the user
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback>
                <UserIcon className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-2xl">{user?.displayName || 'Anonymous User'}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">{t('personalInfo')}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">{t('displayName')}</Label>
                        <Input id="displayName" defaultValue={user?.displayName || ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('emailAddress')}</Label>
                        <Input id="email" defaultValue={user?.email || ''} disabled />
                    </div>
                </div>
                 <Button>{t('updateProfile')}</Button>
            </div>
            
            <div className="space-y-4 rounded-lg border border-destructive p-4">
                <h3 className="font-headline text-lg font-semibold text-destructive">{t('dangerZone')}</h3>
                <div className='flex items-center justify-between'>
                    <div>
                        <p className="font-medium">{t('logOut')}</p>
                        <p className="text-sm text-muted-foreground">{t('logOutDescription')}</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>{t('logOut')}</Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
