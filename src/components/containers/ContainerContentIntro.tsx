"use client";

import useAccountQuery from "@/queries/useAccountQuery";
import TypographyContentTitle from "../typography/TypographyContentTitle";
import TypographyContentDescription from "../typography/TypographyContentDescription";
import ContainerSeeMore from "./ContainerSeeMore";
import TypographyCopy from "../typography/TypographyCopy";
import { getShortAddress } from "@/utils/tools";
import etherSvg from "@/images/ethereum-eth-logo.svg";
import Image from "next/image";
import IconLink from "../common/IconLink";
import { useEffect, useState } from "react";
import { PLATFORM_LINKS } from "../../../constants";
import { FaGear } from "react-icons/fa6";
import LoadingSpinner from "../common/LoadingSpinner";
import useCollectorQuery from "@/queries/useCollectorQuery";
import ImageCuniverse from "../common/ImageCuniverse";

// Collectors(Accounts) 페이지에서 사용되는
// 사용자 소개 Component

interface ContainerContentIntroProps {
  account?: Account | null;
  isLoading: boolean;
  self: boolean;
}

function ContainerContentIntro(props: ContainerContentIntroProps) {
  const { account, isLoading, self } = props;

  const [links, setLinks] = useState<PlatformLinkWithHref[]>([]);

  useEffect(() => {
    if (account) {
      const tmpLinks: PlatformLinkWithHref[] = [];

      // 사용자가 정의한 소개 페이지(youtube, twitch 등) 링크 여부에 따라 데이터 추가
      for (let i = 0; i < PLATFORM_LINKS.length; i++) {
        if (account[PLATFORM_LINKS[i].platform])
          tmpLinks.push({
            ...PLATFORM_LINKS[i],
            href: account[PLATFORM_LINKS[i].platform] ?? "",
          });
      }
      setLinks([...tmpLinks]);
    }
  }, [account]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container-content-intro">
      <div className="nickname-wrapper">
        <TypographyContentTitle
          title={account?.nickname ? account.nickname : "Unnamed"}
        />
        {/* 사용자 본인이라면 settings 페이지 이동 가능하도록 설정 */}
        {!self ? null : (
          <IconLink
            href="/account/settings"
            icon={<FaGear />}
            target="_self"
            tooltipText="프로필 수정"
          />
        )}
      </div>
      <div className="address-wrapper">
        {/* Wallet Address */}
        <ImageCuniverse
          src={etherSvg}
          alt="ethereum-logo"
          width={16}
          height={16}
        />
        <TypographyCopy
          text={account?.address ? getShortAddress(account.address) : ""}
          copyText={account?.address ?? ""}
          className="intro-address"
        />
        <span className="joined">Joined {account?.createdAt}</span>
      </div>
      <div className="links-wrapper">
        {/* Links */}
        {links.map((link, linkIdx) => {
          return (
            <IconLink
              key={`icon-link-${linkIdx}`}
              href={link.href}
              icon={link.icon}
              tooltipText={link.platform}
            />
          );
        })}
      </div>
      {/* 소개 Description */}
      <ContainerSeeMore defaultMaxHeight={50}>
        <TypographyContentDescription
          description={account?.description ? account.description : ""}
        />
      </ContainerSeeMore>
    </div>
  );
}

export default ContainerContentIntro;
