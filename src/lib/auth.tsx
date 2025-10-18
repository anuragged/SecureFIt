"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  type User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const firestore = useFirestore();

  const login = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<void> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: name });

      if (firestore) {
        const userProfileRef = doc(firestore, `users/${firebaseUser.uid}/userProfile`, 'profile');
        const userProfileData = {
          id: firebaseUser.uid,
          userId: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ')[1] || '',
        };
        setDocumentNonBlocking(userProfileRef, userProfileData, { merge: true });
      }
      
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading: isUserLoading || loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
