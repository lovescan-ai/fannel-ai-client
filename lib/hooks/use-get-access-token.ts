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
  short_lived_token: string;
  recipient_id: string;
  username: string;
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
        if (!creatorId) {
          toast.error("Creator ID is required");
          return;
        }
        toast.loading("Connecting instagram account...");

        const { data } = await apiClient.get<AccessTokenResponse>(
          `/instagram/access-token`,
          {
            params: { code },
          }
        );

        if (data.access_token || data.short_lived_token) {
          console.log("data", data);
          console.log("creatorId", creatorId);
          await Promise.all([
            mutate({
              creatorId,
              data: {
                instagramAccessToken:
                  data.access_token || data.short_lived_token,
                instagramAccountId: data.user_id.toString(),
                connectedInstagram: true,
                connectedCreator: true,
                isActive: true,
                maxCredit: 5000,
              },
            }),
            updateUser({
              onboardedDefaultCreator: true,
            }),
          ]);
        }

        // sleep for 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10000));

        // Read KV store but defer navigation
        const kv = await readPageTracker();

        if (kv.isDisconnected && kv.previousPage) {
          router.push(kv.previousPage);
          return;
        }

        if (kv.nextPage && kv.nextPage.length > 0) {
          router.push(`${kv.nextPage}?id=${encodeURIComponent(creatorId)}`);
        } else {
          // Only close if we're in a popup context
          if (window.opener) {
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
    [mutate, updateUser, router]
  );

  return {
    getAccessToken,
    isLoading,
    error,
  };
};
