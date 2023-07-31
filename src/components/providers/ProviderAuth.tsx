import getQueryClient from "@/utils/getQueryClient";
import { dehydrate, Hydrate } from "@tanstack/react-query";

async function ProviderAuth({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}

export default ProviderAuth;
