import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { auth } from '@/app/firebase';
interface AuthContextType {
  isVerified: boolean;
  isLoading: boolean;
  userPhone: string | null;
  userName: string | null;
  setUserName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const setUserName = async (name: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name });
    setUser({ ...auth.currentUser }); // trigger re-render with new displayName
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        isVerified: !!user,
        isLoading,
        userPhone: user?.phoneNumber ?? null,
        userName: user?.displayName ?? null,
        setUserName,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
