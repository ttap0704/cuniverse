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
    nickname: string;
    banner: string;
    profile: stirng;
    description: string;
  }

  // Account Info 수정 Request Body
  interface UpdateAccountRequest {
    nickname?: string;
    banner?: string;
    profile?: string;
    description?: string;
  }

  // Account 공통 Interface
  interface Account extends AccountInfoReponse {
    balance: string;
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
    id: string | number;
    label: string;
    icon?: React.ReactNode;
  }
}
