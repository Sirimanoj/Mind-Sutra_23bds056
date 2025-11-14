
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { Loader, Chrome } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function AuthForm() {
  const t = useTranslations('Auth');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().optional(),
    email: z.string().email({ message: t('form.invalidEmail') }),
    password: z.string().min(8, { message: t('form.passwordLength') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const createUserInFirestore = async (user: User, name?: string) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'userAccounts', user.uid);
    // Use setDoc with merge:true to avoid overwriting existing data if user logs in with different providers
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      displayName: name || user.displayName || 'Anonymous User',
      role: 'student', // Default role
      languagePreference: 'en',
    }, { merge: true });
  };

  const handleAuthSuccess = (user: User, name?: string) => {
    createUserInFirestore(user, name);
    toast({ title: t('signInSuccess') });
    router.push('/dashboard');
  };

  const handleAuthError = (error: any, type: 'signIn' | 'signUp') => {
    console.error(`${type} error:`, error);
    let description = error.message;
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        description = t('signInErrorInvalid');
    } else if (error.code === 'auth/email-already-in-use') {
        description = t('signUpErrorEmailInUse');
    }
    toast({
      title: type === 'signIn' ? t('signInError') : t('signUpError'),
      description: description,
      variant: 'destructive',
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (activeTab === 'signup') {
        if (!values.name) {
            form.setError("name", { type: "manual", message: t('form.nameRequired') });
            setIsLoading(false);
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await updateProfile(userCredential.user, { displayName: values.name });
        // The onAuthStateChanged listener will handle the redirect and Firestore creation
        // but we can call it here explicitly to be sure
        handleAuthSuccess(userCredential.user, values.name);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        // onAuthStateChanged will handle the redirect
        // handleAuthSuccess(userCredential.user);
      }
    } catch (error) {
      handleAuthError(error, activeTab === 'signin' ? 'signIn' : 'signUp');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle redirect, but we can ensure Firestore doc is created.
      // Check if this is a new user
      // const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
      // if (isNewUser) {
        handleAuthSuccess(result.user);
      // }
    } catch (error) {
      handleAuthError(error, 'signIn');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email) {
      form.setError('email', { type: 'manual', message: t('form.required') });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: t('passwordResetSent') });
    } catch (error: any) {
      toast({
        title: t('passwordResetError'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">{t('signInButton')}</TabsTrigger>
          <TabsTrigger value="signup">{t('signUpButton')}</TabsTrigger>
        </TabsList>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <TabsContent value="signin" className="space-y-4 m-0">
               <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('emailLabel')}</FormLabel>
                    <FormControl><Input placeholder={t('emailPlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>{t('passwordLabel')}</FormLabel>
                            <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={handlePasswordReset}>{t('forgotPassword')}</Button>
                        </div>
                        <FormControl><Input type="password" placeholder={t('passwordPlaceholder')} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    {t('signInButton')}
                </Button>
            </TabsContent>
             <TabsContent value="signup" className="space-y-4 m-0">
                 <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('nameLabel')}</FormLabel>
                    <FormControl><Input placeholder={t('namePlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
               <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('emailLabel')}</FormLabel>
                    <FormControl><Input placeholder={t('emailPlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('passwordLabel')}</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    {t('signUpButton')}
                </Button>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
      <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t('orContinueWith')}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
            {isGoogleLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Chrome className="mr-2 h-4 w-4" />
            )}
            {t('googleSignIn')}
        </Button>
         <p className="mt-4 px-8 text-center text-xs text-muted-foreground">
          {t('privacyPolicy')}
        </p>
    </div>
  );
}
