import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();
  const isCheckingRole = useRef(false);

  const checkUserRole = useCallback(async (userId: string) => {
    if (isCheckingRole.current) return;
    isCheckingRole.current = true;
    
    try {
      const { data } = await supabase.rpc('get_user_role');
      setIsAdmin(data === 'admin');
    } catch {
      setIsAdmin(false);
    } finally {
      isCheckingRole.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get initial session - don't block on role check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Check role in background (non-blocking)
      if (session?.user) {
        checkUserRole(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (session?.user) {
          checkUserRole(session.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkUserRole]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setIsAdmin(false);
    queryClient.clear();
  }, [queryClient]);

  return {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signOut,
  };
}
