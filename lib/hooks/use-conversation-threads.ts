import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../supabase/action";

const QUERY_KEY = "conversations";

const useConversationThreads = (creatorId: string | undefined) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, creatorId],
    queryFn: () => {
      if (!creatorId) {
        throw new Error("Creator ID is undefined");
      }
      return getConversations(creatorId);
    },
    enabled: !!creatorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    conversations: data,
    isLoading,
    error,
    refetchConversations: refetch,
  };
};

export default useConversationThreads;
