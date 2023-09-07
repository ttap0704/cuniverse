import type { MetaMaskInpageProvider } from "@metamask/providers";
import { GetOwnersForNftResponse, Nft, NftAttributeRarity } from "alchemy-sdk";
import { Account } from "aws-sdk";
import React from "react";

declare global {
  // 문자열 또는 숫자
  type StringOrNumber = string | number;

  // window ethureum 타입
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }

  // API Reponse 공통 타입
  interface APIResponse {
    pass: boolean;
    message: string;
    data: any | any[] | object;
  }

  // API Request Body 공통 타입
  interface APIRequestBody {
    time: string;
    data: any;
  }

  // Account Info 조회 시 Response
  interface AccountInfoReponse {
    id: number;
    address: string;
    nickname: string | null;
    banner: string | null;
    profile: stirng | null;
    description: string | null;
    website: string | null;
    twitter: string | null;
    youtube: string | null;
    afreecatv: string | null;
    instagram: string | null;
    twitch: string | null;
    createdAt: string;
  }

  // Account Info 수정가능 Keys
  type UpdateAccountKeys =
    | "nickname"
    | "description"
    | "website"
    | "twitter"
    | "youtube"
    | "afreecatv"
    | "instagram"
    | "twitch";

  // Account Info 수정 Request Body
  interface UpdateAccountRequest {
    nickname?: string;
    banner?: string;
    profile?: string;
    description?: string;
    website?: string;
    twitter?: string;
    youtube?: string;
    afreecatv?: string;
    instagram?: string;
    twitch?: string;
  }

  // Account Info 수정 Request Body
  interface UpdateAccountSalesRequest {
    accountId: number;
    tokenId: string;
    contractAddress: string;
    canceledAt?: number;
    completedAt?: number;
  }

  // Account 공통 Interface
  type AccountClient = Omit<AccountInfoReponse, "createdAt">;
  interface Account extends AccountClient {
    balance: string;
    createdAt: string;
  }

  // NFT Metdata
  interface NFTMetadata {
    tokenId: string;
    title?: string;
    name?: string;
    description?: string;
    image?: string;
    external_url?: string;
    background_color?: string;
    animation_url?: string;
    youtube_url?: string;
    attributes?: {
      trait_type: string;
      value: string;
      display_type?: string;
    }[];
    contract?: {
      address: string;
      name: string;
    };
    price?: number;
    royalty?: number;
  }

  // Collector 공통 Type
  // Collector는 balance를 가져올 필요없음 => Web3 사용하지 않아도 됨
  type Collector = Omit<Account, "balance">;

  // Button 공통 Interface
  interface InterfaceButton {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    className?: string;
    ref?: React.Ref;
    id?: string;
    testid?: string;
    disabled?: boolean;
  }

  // Dropdown Menu Items Interface
  interface DropdownMenuItem {
    id: StringOrNumber;
    label: string;
    icon?: React.ReactNode;
  }

  // Tabs Menu Items Interface
  interface TabsMenuItem {
    id: number;
    label: string;
    path: string;
    includePath?: string[];
  }

  // 유저/스마트 컨트랙트 소개 플랫폼
  type Platforms =
    | "youtube"
    | "twitter"
    | "afreecatv"
    | "website"
    | "instagram"
    | "twitch";
  interface PlatformLink {
    platform: Platforms;
    icon: React.ReactNode;
  }
  interface PlatformLinkWithHref extends PlatformLink {
    href: string;
  }

  type InputTypes = "text" | "number" | "textarea" | "file" | "dropdown";
  // Input 공통 Interface
  interface InputProps {
    id: string;
    dataKey: string;
    value: StringOrNumber;
    type: InputTypes;
    onChange: (text: StringOrNumber, error: boolean) => void;
    validation?: (text: StringOrNumber) => string;
    errorMessage?: string;
    readOnly?: boolean;
    placeholder?: string;
    items?: DropdownMenuItem[];
    direct?: boolean; // 입력 시, 바로 이벤트 전달
  }

  // NFT Detail
  type NFTTransferLog = {
    from: string;
    to: string;
    hash: string;
    name: string;
  };
  interface NFTDetail extends NFTMetadata {
    contract: { name: string; address: string };
    owners: { nickname: string; address: string };
    deployer: { nickname: string; address: string; contractId?: number };
    sale: SalesDetail | null;
    royalty: number;
  }

  // Contract Detail
  interface ContractDetail {
    id: number;
    contractAddress: string;
    accountId: number;
    name: string;
    symbol: string;
    description: string;
    banner?: string;
    profile?: string;
    latestBlockNumber?: number;
    totalSupply: number;
    createdAt: string;
    created: number;
  }

  // Collection Detail
  interface CollectionDetail extends ContractDetail {
    deployerNickname: string;
    deployerAddress: string;
    nfts: NFTMetadata[];
  }

  // Radio Button 공통 Interface
  interface ButtonRadioInterface {
    title: string;
    description: string;
    checked: boolean;
    id: string;
  }

  // Account Info 수정가능 Keys
  type UpdateContractKeys =
    | "banner"
    | "profile"
    | "name"
    | "symbol"
    | "description"
    | "royalty";

  // Contract 생성 Request Body
  interface CreateContractRequest {
    banner?: string;
    profile?: string;
    name: string;
    symbol: string;
    description: string;
    contractAddress: string;
    accountId: number;
    created: number;
    royalty: string;
  }

  // Contract 수정 Request Body
  interface UpdateContractRequest {
    banner?: string;
    profile?: string;
    name?: string;
    symbol?: string;
    description?: string;
  }

  // NFT 판매 모달 Item Type
  interface ModalSaleNFTItem {
    image: string;
    name: string;
    contractName: string;
    contractAddress: string;
    tokenId: string;
  }

  // Sales Detail
  interface SalesDetail {
    accountId: number;
    contractAddress: string;
    tokenId: string;
    price: string;
    startTime: number;
    endTime: number;
    v: number;
    r: string;
    s: string;
    image: string;
    title: string;
    name: string;
    signature: string;
    canceledAt: string;
    completedAt: string;
  }

  type CreateSalesDetailRequest = Omit<
    SalesDetail,
    "canceledAt",
    "completedAt"
  >;

  // Table types
  type TableItemMode = "link" | "text" | "copy";
  type TableContentsWidth = { [key: string]: number };
  type TableHeaderProps = { [key: string]: string };
  type TableBodyProps = {
    [key: string]: {
      mode: TableItemMode;
      value: StringOrNumber;
      copyText?: string;
    };
  };

  interface TableProps {
    keys: string[];
    width: TableContentsWidth;
    titles: TableHeaderProps;
    items: TableBodyProps[];
  }

  interface Banner {
    id: number;
    image: string;
    background: string;
    link: string;
    startTime: string;
    endTime: string;
  }
}
