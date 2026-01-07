'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider, FirebaseProviderProps } from './provider';

// This is a bit of a hack to get around the fact that the Firebase
// SDK is not designed to be used in a server-side rendering environment.
// We only want to initialize Firebase on the client-side.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<FirebaseProviderProps | null>(null);

  useEffect(() => {
    setFirebase(initializeFirebase());
  }, []);

  if (!firebase) {
    return null;
  }

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
