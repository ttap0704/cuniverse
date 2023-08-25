import { fetchUpdateAccountSales } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as accountNFTQueryKey } from "./useAccountNFTsQuery";

const fetcher = (data: { data: UpdateAccountSalesRequest }) =>
  fetchUpdateAccountSales(data);

const useAccountSalesUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res, { data }) => {
      if (res) {
        const oldNFTs = queryClient.getQueryData([
          accountNFTQueryKey,
        ]) as NFTMetadata[];

        await queryClient.cancelQueries([accountNFTQueryKey]);

        queryClient.setQueryData([accountNFTQueryKey], () => {
          return oldNFTs.map((item) => {
            const NFT = JSON.parse(JSON.stringify(item));

            if (
              NFT.contract?.address == data.contractAddress &&
              NFT.tokenId == data.tokenId
            ) {
              if (data.canceledAt) NFT.price = undefined;
            }
            return NFT;
          });
        });
      }
    },
  });
};

export default useAccountSalesUpdateMutation;
