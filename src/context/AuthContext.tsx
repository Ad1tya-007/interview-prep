'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/client';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use createClient which is already a singleton with caching
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    console.log('Logout function called');
    try {
      // Use client-side logout only to avoid CORS issues
      console.log('Signing out on client side');
      await supabase.auth.signOut();
      console.log('Client side signout complete');

      // Update the state
      console.log('Setting user to null');
      setUser(null);

      // Force a hard refresh to ensure all auth state is cleared
      console.log('Redirecting to home page');
      window.location.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
