import type { MetaMaskInpageProvider } from "@metamask/providers";
import React from "react";

declare global {
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
    created_at: string;
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

  // Account 공통 Interface
  type AccountClient = Omit<AccountInfoReponse, "created_at">;
  interface Account extends AccountClient {
    balance: string;
    createdAt: string;
  }

  // Button 공통 Interface
  interface InterfaceButton {
    children: React.ReactNode;
    onClick: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    className?: string;
    ref?: React.Ref;
    id?: string;
    testid?: string;
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
    includePath?: string;
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

  // Input 공통 Interface
  interface InputProps {
    id: string;
    dataKey: string;
    value: StringOrNumber;
    type: "text" | "number" | "textarea";
    onChange: (text: StringOrNumber, error: boolean) => void;
    validation?: (text: StringOrNumber) => string;
    errorMessage?: string;
  }

  // 문자열 또는 숫자
  type StringOrNumber = StringOrNumber;
}
