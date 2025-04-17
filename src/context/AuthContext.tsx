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
import { usePathname, useRouter } from 'next/navigation';
import { logout as serverLogout } from '@/app/auth/actions';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
        const newUser = session?.user ?? null;
        setUser(newUser);
        setIsLoading(false);

        // Handle immediate redirects based on auth events
        if (event === 'SIGNED_IN' && pathname === '/auth') {
          router.replace('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          router.replace('/auth');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, pathname, router]);

  // Handle redirects based on auth state and current path
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname === '/auth';

      if (!user && !isAuthPage) {
        router.replace('/auth');
      } else if (user && isAuthPage) {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const logout = async () => {
    try {
      const result = await serverLogout();

      // If there's an error from the server action
      if (result?.error) {
        console.error('Error during logout:', result.error);
        return;
      }

      // Handle client-side state update and navigation
      setUser(null);
      router.replace('/auth');
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
