import { fetchUpdateAccount } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as accountQueryKey } from "./useAccountQuery";

const fetcher = (data: { data: UpdateAccountRequest }) =>
  fetchUpdateAccount(data);

const useAccountUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      if (res) {
        queryClient.invalidateQueries([accountQueryKey]);
      }
    },
  });
};

export default useAccountUpdateMutation;
