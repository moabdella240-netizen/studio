import {
  createContext,
  useContext,
  type ReactNode,
  type ComponentType,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export interface FirebaseProviderProps {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  children?: ReactNode;
}

const FirebaseContext = createContext<FirebaseProviderProps | undefined>(
  undefined,
);

export function FirebaseProvider({ children, ...props }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={props}>{children}</FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().firebaseApp;
}

export function useFirestore() {
  return useFirebase().firestore;
}

export function useAuth() {
  return useFirebase().auth;
}

export function withFirebase(Component: ComponentType<any>) {
  return function WithFirebase(props: any) {
    const firebase = useFirebase();
    return <Component {...props} {...firebase} />;
  };
}
