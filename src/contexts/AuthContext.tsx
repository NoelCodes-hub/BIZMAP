import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type AppRole = 'admin' | 'business' | 'user' | 'guest';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  isLoading: boolean;
  signUp: (email: string, password: string, displayName?: string, accountType?: 'user' | 'business') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInAsGuest: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isBusiness: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_role', { _user_id: userId });
      if (!error && data) {
        setRole(data as AppRole);
      } else {
        setRole('user');
      }
    } catch {
      setRole('user');
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchRole(session.user.id), 0);
        } else {
          setRole(null);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string, accountType?: 'user' | 'business') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName || email, account_type: accountType || 'user' },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInAsGuest = async () => {
    // Guest sign-in uses a special guest account
    const guestEmail = `guest_${Date.now()}@bizmap.guest`;
    const guestPassword = `guest_${Date.now()}_${Math.random().toString(36)}`;
    
    const { error: signUpError } = await supabase.auth.signUp({
      email: guestEmail,
      password: guestPassword,
      options: {
        data: { display_name: 'Guest User' },
      },
    });
    
    if (signUpError) return { error: signUpError };
    
    // Update the role to guest
    const { data: { user: guestUser } } = await supabase.auth.getUser();
    if (guestUser) {
      await supabase.from('user_roles').update({ role: 'guest' as any }).eq('user_id', guestUser.id);
      setRole('guest');
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      role,
      isLoading,
      signUp,
      signIn,
      signInAsGuest,
      signOut,
      isAdmin: role === 'admin',
      isBusiness: role === 'business',
      isGuest: role === 'guest',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
