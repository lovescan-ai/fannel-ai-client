import { Session, User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "../supabase/browser-client";

const useReadUser = () => {
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const fetchUserAndSession = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSession();

    // Set up authentication listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      setLoading(false);
      router.refresh();
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  return { session, user, error, loading, signOut };
};

export default useReadUser;
