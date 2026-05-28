"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier;
  signInWithPhoneNumber: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (credential.user) {
      await updateProfile(credential.user, { displayName: name });
      // Force local user object refresh with updated name
      setUser({ ...credential.user, displayName: name } as User);
    }
    return credential;
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    // Configure standard settings if needed (e.g. prompt select_account)
    provider.setCustomParameters({ prompt: "select_account" });
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const setupRecaptcha = (containerId: string) => {
    return new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  };

  const signInWithPhone = (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        resetPassword,
        setupRecaptcha,
        signInWithPhoneNumber: signInWithPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
