'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  // In a production environment (like Firebase App Hosting), the config is provided automatically.
  // In a local development environment, we must provide it.
  const isProduction = process.env.NODE_ENV === 'production';
  
  let firebaseApp;
  
  if (isProduction) {
    try {
      // For App Hosting, initializeApp() discovers the config automatically.
      firebaseApp = initializeApp();
    } catch (e) {
      console.warn('Automatic Firebase initialization failed in production, falling back to config object.', e);
      // Fallback for cases where auto-init might fail even in prod.
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    // For local development, always use the explicit config.
    firebaseApp = initializeApp(firebaseConfig);
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
