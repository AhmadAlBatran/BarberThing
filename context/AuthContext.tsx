import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isVerified: boolean;
  isLoading: boolean;
  userPhone: string | null;
  verifyPhone: (phoneNumber: string, otpCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check persistent session on app mount
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const storedPhone = await AsyncStorage.getItem('user_phone');
        const isAuth = await AsyncStorage.getItem('is_verified');

        if (storedPhone && isAuth === 'true') {
          setUserPhone(storedPhone);
          setIsVerified(true);
        }
      } catch (e) {
        console.error('Failed to load auth state:', e);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthSession();
  }, []);

  // Set session upon successful OTP check
  const verifyPhone = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem('user_phone', phoneNumber);
      await AsyncStorage.setItem('is_verified', 'true');

      setUserPhone(phoneNumber);
      setIsVerified(true);
      return true;
    } catch (e) {
      console.error('Failed to save auth state:', e);
      return false;
    }
  };

  // Clear session on logout
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user_phone', 'is_verified']);
      setUserPhone(null);
      setIsVerified(false);
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ isVerified, isLoading, userPhone, verifyPhone, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
