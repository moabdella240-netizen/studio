import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

export function initializeFirebase() {
  const isConfigured = getApps().length > 0;
  const firebaseApp = isConfigured
    ? getApps()[0]
    : initializeApp(firebaseConfig);

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  // NOTE: In a real app, you would want to only use the emulator
  // in a development environment.
  // connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  // connectAuthEmulator(auth, 'http://127.0.0.1:9099');

  return { firebaseApp, firestore, auth };
}

export * from './provider';
export * from './auth/use-user';
