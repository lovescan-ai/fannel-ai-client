import { Session, User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { createSupabaseBrowserClient } from "../supabase/browser-client";

const useReadUser = () => {
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    const fetchUserAndSession = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        console.log("authenticating user data rn", data);
        setUser(data.session?.user ?? null);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSession();
  }, [supabase]);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setLoading(false);
  };

  return { session, user, error, loading, signOut };
};

export default useReadUser;
