"use client";

import ContainerBanner from "@/components/containers/ContainerBanner";
import useAccountQuery from "@/queries/useAccountQuery";

function AccountIndex() {
  const { data: account } = useAccountQuery();

  return (
    <>
      <ContainerBanner
        defaultUri={account && account.banner ? account.banner : ""}
        edit={true}
      />
    </>
  );
}

export default AccountIndex;
