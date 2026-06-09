import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { signInAdmin, signOutAdmin, verifyAdminSession } from "../utils/adminApi";

export function useAdminAuth() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  const checkSession = useCallback(async (currentSession) => {
    if (!currentSession?.user?.email) {
      setIsAdmin(false);
      return false;
    }

    const allowed = await verifyAdminSession(currentSession);
    setIsAdmin(allowed);

    if (!allowed && currentSession) {
      await supabase.auth.signOut();
      setSession(null);
    }

    return allowed;
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      if (!mounted) return;
      setSession(current);
      checkSession(current).finally(() => {
        if (mounted) setLoading(false);
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, current) => {
      setSession(current);
      checkSession(current);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkSession]);

  const login = async (email, password) => {
    setSigningIn(true);
    try {
      const { session: newSession } = await signInAdmin(email, password);
      setSession(newSession);
      setIsAdmin(true);
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    await signOutAdmin();
    setSession(null);
    setIsAdmin(false);
  };

  return {
    session,
    isAdmin,
    loading,
    signingIn,
    login,
    logout,
  };
}
