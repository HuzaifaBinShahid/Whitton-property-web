import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  initialize: async () => {
    // Get initial session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
    }

    set({ 
      session, 
      user: session?.user ?? null,
      isLoading: false 
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ 
        session, 
        user: session?.user ?? null 
      });
    });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  }
}));
