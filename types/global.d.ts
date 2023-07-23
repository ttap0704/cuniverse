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

  // User 공통 Interface
  interface User {
    address: string;
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
  }

  // Dropdown Menu Items Interface
  interface DropdownMenuItem {
    id: string | number;
    label: string;
    icon?: React.ReactNode;
  }
}
