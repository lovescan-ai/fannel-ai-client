import { useState, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import apiClient from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { disconnectInstagram } from "../supabase/action";
import { useRouter } from "next/navigation";
interface ConnectSocialResult {
  connectSocial: () => Promise<void>;
  authorizationUrl: string;
  isLoading: boolean;
  error: string | null;
}

const useConnectSocial = (): ConnectSocialResult => {
  const [authorizationUrl, setAuthorizationUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectSocial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAuthorizationUrl("");

    try {
      const response = await apiClient.get(`/instagram/authorize`, {
        responseType: "text",
      });

      const data = response.data;

      if (typeof data !== "string" || !data.startsWith("http")) {
        throw new Error("Invalid authorization URL received");
      }

      setAuthorizationUrl(data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data || err.message
        : "An unknown error occurred";
      setError(errorMessage);
      toast.error(`Failed to connect to Instagram: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { connectSocial, authorizationUrl, isLoading, error };
};

export default useConnectSocial;

export const useDisconnectSocial = () => {
  const router = useRouter();
  const { mutate: disconnectSocial, isPending } = useMutation({
    mutationFn: async ({ creatorId }: { creatorId: string }) => {
      toast.loading("Disconnecting account");
      const response = await disconnectInstagram(creatorId);
      return response;
    },
    onSuccess: (data) => {
      toast.success("Account disconnected!");
      router.push("/auth/connect-social");
    },
    onError: (data) => {
      toast.error("Unable to disconnect account");
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  return { disconnectSocial, isDisconnecting: isPending };
};
