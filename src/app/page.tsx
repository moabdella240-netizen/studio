'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppShell from "@/components/layout/app-shell";

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // You can replace this with a loading spinner or a splash screen
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return <AppShell />;
}
