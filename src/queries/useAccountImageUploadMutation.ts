import { fetchAccountImageUpload } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as accountQueryKey } from "./useAccountQuery";

const fetcher = (data: { image: File; key: string }) =>
  fetchAccountImageUpload(data);

const useAccountImageUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      if (res) {
        queryClient.invalidateQueries([accountQueryKey]);
      }
    },
  });
};

export default useAccountImageUploadMutation;
