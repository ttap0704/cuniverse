import { QUERY_KEY as accountQueryKey } from "@/queries/useAccountQuery";
import { fetchGetAccountInfo } from "@/utils/api";
import getQueryClient from "@/utils/getQueryClient";
import { dehydrate, Hydrate } from "@tanstack/react-query";

async function ProviderAuth({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([accountQueryKey], fetchGetAccountInfo);
  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}

export default ProviderAuth;
