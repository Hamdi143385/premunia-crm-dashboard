
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthUser, UserProfile } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserData(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (authUser: User) => {
    try {
      console.log('Fetching user data for:', authUser.email);
      
      // Fetch user data with role information
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          role:roles(id, nom)
        `)
        .eq('email', authUser.email)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        // Create basic auth user without profile
        const basicUser: AuthUser = {
          id: authUser.id,
          email: authUser.email,
          user_metadata: authUser.user_metadata,
          app_metadata: authUser.app_metadata,
        };
        setUser(basicUser);
        setLoading(false);
        return;
      }

      console.log('User data fetched:', userData);

      const enrichedUser: AuthUser = {
        id: authUser.id,
        email: authUser.email,
        user_metadata: authUser.user_metadata,
        app_metadata: authUser.app_metadata,
        profile: {
          id: userData.id,
          email: userData.email,
          nom_complet: userData.nom_complet,
          equipe_id: userData.equipe_id,
          role_id: userData.role_id,
          statut: userData.statut,
          created_at: userData.created_at,
          role: userData.role
        }
      };

      setUser(enrichedUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Create basic auth user on error
      const basicUser: AuthUser = {
        id: authUser.id,
        email: authUser.email,
        user_metadata: authUser.user_metadata,
        app_metadata: authUser.app_metadata,
      };
      setUser(basicUser);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const userRole = user?.profile?.role?.nom || null;

  const value = {
    user,
    loading,
    signIn,
    signOut,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
