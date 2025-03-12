import { getUser, updateUser } from "@/lib/supabase/action";
import { User } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

const USER_QUERY_KEY = ["user"];

type UpdateUserData = Partial<User>;

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserData>({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      toast.success("User updated successfully");
      // Invalidate and refetch user query
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      // Update user data in the cache
      queryClient.setQueryData(USER_QUERY_KEY, updatedUser);
    },
    onError: (error) => {
      toast.error(`User update failed: ${error.message}`);
    },
  });
};

export const useUser = (): UseQueryResult<User | null, Error> => {
  const result = useQuery<User | null, Error>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const user = await getUser();
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  return result;
};
