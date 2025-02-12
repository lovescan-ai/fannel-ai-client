import { useState, useCallback } from "react";
import { useUpdateCreator } from "./use-creator";
import { useRouter } from "next/navigation";
import { useUserUpdate } from "./use-user";
import { toast } from "sonner";
import axios from "axios";
import apiClient from "@/utils/axios";
import { readPageTracker } from "../kv/actions";

interface AccessTokenResponse {
  message: string;
  user_id: string;
  access_token: string;
}

interface GetAccessTokenParams {
  code: string;
  creatorId: string;
}

export const useGetAccessToken = (page?: "account") => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useUpdateCreator();
  const { mutate: updateUser } = useUserUpdate();
  const router = useRouter();

  const getAccessToken = useCallback(
    async ({ code, creatorId }: GetAccessTokenParams) => {
      setIsLoading(true);
      setError(null);

      try {
        toast.loading("Connecting instagram account...");

        const { data } = await apiClient.get<AccessTokenResponse>(
          `/instagram/access-token`,
          {
            params: { code },
          }
        );

        if (data.access_token) {
          await Promise.all([
            mutate({
              creatorId,
              data: {
                instagramAccessToken: data.access_token,
                instagramAccountId: data.user_id.toString(),
                connectedInstagram: true,
                connectedCreator: true,
                isActive: true,
              },
            }),
            updateUser({
              onboardedDefaultCreator: true,
            }),
          ]);

          const kv = await readPageTracker();
          toast.loading("Redirecting to creator details...");

          if (kv.nextPage) {
            router.push(`${kv.nextPage}?id=${encodeURIComponent(creatorId)}`);
          } else {
            window.close();
          }
        }
        toast.success("Instagram account connected successfully");
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? new Error(err.response?.data?.message || err.message)
            : new Error("An unknown error occurred")
        );
        console.error("Error in getAccessToken:", err);
      } finally {
        setIsLoading(false);
        toast.dismiss();
      }
    },
    [mutate, router]
  );

  return {
    getAccessToken,
    isLoading,
    error,
  };
};
