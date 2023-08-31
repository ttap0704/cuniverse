import { fetchInsertSales } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as accountNFTQueryKey } from "./useAccountNFTsQuery";

const fetcher = (createData: { data: SalesDetail }) =>
  fetchInsertSales(createData.data);

const useAccountSalesCreateMutation = () => {
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
            const NFT = JSON.parse(JSON.stringify(item)) as NFTMetadata;

            if (
              NFT.contract?.address == data.contractAddress &&
              NFT.tokenId == data.tokenId
            ) {
              NFT.price = Number(data.price);
            }
            return NFT;
          });
        });
      }
    },
  });
};

export default useAccountSalesCreateMutation;
