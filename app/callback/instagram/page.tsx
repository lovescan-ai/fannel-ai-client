"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { readPageTracker } from "@/lib/kv/actions";
import { useGetAccessToken } from "@/lib/hooks/use-get-access-token";
import { Loader } from "lucide-react";

const InstagramCallback = () => {
  const { getAccessToken } = useGetAccessToken();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("Initializing authorization...");

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("No authorization code received from Instagram");
      setIsProcessing(false);
      return;
    }

    const handleCallback = async () => {
      try {
        setProgress("Reading page tracking information...");
        const kv = await readPageTracker();

        setProgress("Exchanging authorization code for access token...");
        await getAccessToken({
          code,
          creatorId: kv.creatorId,
        });

        setProgress("Authorization complete! Redirecting...");
        setIsProcessing(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during authorization"
        );
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, router, getAccessToken]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Error Icon */}
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authorization Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            {isProcessing ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader className="w-8 h-8 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Instagram Authorization
                </h2>
                <p className="text-gray-600 text-center">{progress}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Authorization Complete!
                </h2>
                <p className="text-gray-600 text-center">
                  You can now close this window or wait to be redirected.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramCallback;
