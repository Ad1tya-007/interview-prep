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

  // Function to handle user authentication and ensure user exists in the database
  const handleUserAuthentication = async (authUser: User | null) => {
    setUser(authUser);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await handleUserAuthentication(user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        const newUser = session?.user ?? null;

        if (newUser && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          await handleUserAuthentication(newUser);
        } else {
          setUser(newUser);
          setIsLoading(false);
        }

        // Handle immediate redirects based on auth events
        if (event === 'SIGNED_IN' && pathname === '/auth') {
          router.replace('/explore');
        } else if (event === 'SIGNED_OUT') {
          router.replace('/auth');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, pathname, router]);

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/auth'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Handle redirects based on auth state and current path
  useEffect(() => {
    if (!isLoading) {
      if (!user && !isPublicRoute) {
        // Redirect to auth page if trying to access protected route without auth
        router.replace('/auth');
      } else if (user && isPublicRoute) {
        // Redirect authenticated users away from auth page
        router.replace('/explore');
      }
    }
  }, [user, isLoading, pathname, router, isPublicRoute]);

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
