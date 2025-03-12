import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthError, User } from "@supabase/supabase-js";
import {
  createUserWithEmail,
  forgotPassword,
  googleSignIn,
  signInWithPassword,
  signUserOut,
} from "../supabase/action";

type AuthMethod = "google" | "magic" | "password" | null;

interface UseAuthReturn {
  isLoading: boolean;
  signingOut: boolean;
  activeMethod: AuthMethod;
  user: User | null;
  handleGoogleLogin: () => Promise<void>;
  handleSignUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleForgotPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  handleSignOut: () => Promise<void>;
}

const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [activeMethod, setActiveMethod] = useState<AuthMethod>(null);
  const [user, _] = useState<User | null>(null);
  const router = useRouter();

  const handleError = useCallback(
    (error: AuthError | Error, customMessage: string) => {
      console.error(`${customMessage}:`, error);
      toast.error(error.message);
    },
    []
  );

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setActiveMethod("google");
    try {
      const { data, error } = await googleSignIn();

      if (error) {
        toast.error("Error signing in with Google");
        console.error("Error during Google Sign-In:", error);
      } else if (data?.url) {
        // Instead of opening in new window, redirect in same window
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Google auth error: ", error);
      handleError(error as AuthError, "Error initiating Google sign-in");
    } finally {
      setIsLoading(false);
      setActiveMethod(null);
    }
  }, [handleError]);

  const handleSignUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsLoading(true);
      setActiveMethod("magic");
      try {
        const { error, data } = await createUserWithEmail(
          email,
          password,
          fullName
        );

        if (error?.message) {
          toast.error(error.message);
          return;
        } else if (data?.user) {
          toast.success("Check your inbox or spam folder for the magic link");
          router.push("/");
        }
      } catch (error) {
        handleError(error as AuthError, "Error signing up with email");
      } finally {
        setIsLoading(false);
        setActiveMethod(null);
      }
    },
    [handleError, router]
  );

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setActiveMethod("password");
      try {
        const result = await signInWithPassword(email, password);
        if (result?.redirect && !result?.error) {
          toast.success("Successfully signed in");
          router.push(result.redirect);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        handleError(error as AuthError, "Error signing in with email");
        toast.error("Invalid email or password");
      } finally {
        setIsLoading(false);
        setActiveMethod(null);
      }
    },
    [handleError, router]
  );

  const handleForgotPassword = useCallback(
    async (email: string) => {
      setIsLoading(true);
      try {
        const { error } = await forgotPassword(email);
        if (error) throw error;
        toast.success("Check your inbox or spam folder for the reset link");
        return { success: true };
      } catch (error) {
        handleError(error as AuthError, "Error sending reset password email");
        return { success: false, error: (error as Error).message };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      const { error } = await signUserOut();
      if (error) throw error;
      toast.success("Successfully signed out");
      router.push("/");
    } catch (error) {
      handleError(error as Error, "Error signing out");
    } finally {
      setSigningOut(false);
    }
  }, [router, handleError]);

  return {
    isLoading,
    signingOut,
    activeMethod,
    user,
    handleGoogleLogin,
    handleSignUp,
    handleSignIn,
    handleForgotPassword,
    handleSignOut,
  };
};

export default useAuth;
