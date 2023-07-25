"use client";

import ContainerBanner from "@/components/containers/ContainerBanner";
import ContainerProfileImage from "@/components/containers/ContainerProfileImage";
import useAccountQuery from "@/queries/useAccountQuery";

function AccountIndex() {
  const { data: account } = useAccountQuery();

  return (
    <>
      <ContainerBanner
        defaultUri={account && account.banner ? account.banner : ""}
        edit={true}
      />
      <ContainerProfileImage
        defaultUri={account && account.profile ? account.profile : ""}
        edit={true}
      />
    </>
  );
}

export default AccountIndex;
