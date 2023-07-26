"use client";

import ContainerBanner from "@/components/containers/ContainerBanner";
import ContainerProfileImage from "@/components/containers/ContainerProfileImage";
import useAccountQuery from "@/queries/useAccountQuery";
import { DEFAULT_BANNER, DEFAULT_PROFILE } from "../../../constants";

function AccountIndex() {
  const { data: account } = useAccountQuery();

  return (
    <>
      <ContainerBanner
        defaultUri={account && account.banner ? account.banner : DEFAULT_BANNER}
        edit={true}
      />
      <ContainerProfileImage
        defaultUri={
          account && account.profile ? account.profile : DEFAULT_PROFILE
        }
        edit={true}
      />
    </>
  );
}

export default AccountIndex;
