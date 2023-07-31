import { fetchAccountImageUpload } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as accountQueryKey } from "./useAccountQuery";

const fetcher = (data: { image: File; key: string }) =>
  fetchAccountImageUpload(data);

const useAccountImageUploadMutation = () => {
  const query_client = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      if (res) {
        query_client.invalidateQueries([accountQueryKey]);
      }
    },
  });
};

export default useAccountImageUploadMutation;
