import Web3 from "web3";
import { SERVER_NAME } from "../../../next-react-state-management/constants";
import { S3_IMAGES_URL } from "../../constants";
import { Nft, OwnedNftsResponse } from "alchemy-sdk";
import { uploadImageToS3 } from "./tools";
import web3 from "./web3";

function setHeader() {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  return headers;
}

async function fetchGetApi(url: string, options?: RequestInit) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "GET",
    headers: { ...setHeader() },
    ...options,
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchPostApi(body: object, url: string, options?: RequestInit) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "POST",
    headers: { ...setHeader() },
    body: JSON.stringify({ time: new Date().toISOString(), data: body }),
    ...options,
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchPutApi(body: object, url: string, options?: RequestInit) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "PUT",
    headers: { ...setHeader() },
    body: JSON.stringify({ time: new Date().toISOString(), data: body }),
    ...options,
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchDeleteApi(url: string, options?: RequestInit) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "DELETE",
    headers: { ...setHeader() },
    ...options,
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

// Account Update API
export async function fetchUpdateAccount(body: { data: UpdateAccountRequest }) {
  const res: boolean = await fetchPutApi(body.data, `/accounts/info`);
  return res;
}

// Account Image Upload API
export async function fetchAccountImageUpload(body: {
  image: File;
  key: string;
}) {
  const bannerImage = await uploadImageToS3(body.image);
  const res = await fetchUpdateAccount({ data: { [body.key]: bannerImage } });
  return res;
}

// Get Account Info API
export async function fetchGetAccountInfo() {
  const res: AccountInfoReponse | null = await fetchGetApi("/accounts", {
    cache: "no-store",
    credentials: "include",
  });
  let finalResponse: Account | null = null;

  // 유저가 있다면 Query Key ['account'] 최종 업데이트
  if (res && window.ethereum) {
    const balance = await web3.eth.getBalance(res.address);
    const wei = web3.utils.fromWei(balance, "ether");

    finalResponse = {
      ...res,
      banner: res.banner ? `${S3_IMAGES_URL}/images/${res.banner}` : res.banner,
      profile: res.profile
        ? `${S3_IMAGES_URL}/images/${res.profile}`
        : res.profile,
      balance: wei != "0." ? wei.slice(0, 6) : "0",
      createdAt: new Date(res.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
    };
  }

  return finalResponse;
}

// Get Collector Info API
export async function fetchGetCollectorInfo(address: string) {
  const res: AccountInfoReponse | null = await fetchGetApi(
    `/collectors?address=${address}`,
    {
      cache: "no-store",
    }
  );
  let finalResponse: Collector | null = null;

  // 유저가 있다면 Query Key ['collector'] 최종 업데이트
  if (res) {
    finalResponse = {
      ...res,
      banner: res.banner ? `${S3_IMAGES_URL}/images/${res.banner}` : res.banner,
      profile: res.profile
        ? `${S3_IMAGES_URL}/images/${res.profile}`
        : res.profile,
      createdAt: new Date(res.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
    };
  }

  return finalResponse;
}

// 사용자 NFT Collection List
export async function fetchGetCollectorNFTs(address: string) {
  const res: OwnedNftsResponse | null = await fetchGetApi(
    `/collectors/collections?address=${address}`
  );
  return res;
}

// S3 이미지 업로드 권한 취득 API
export async function fetchUploadS3(body: object) {
  const res: string = await fetchPostApi(body, "/image/upload");
  return res;
}

// 사용자 NFT Collection List
export async function fetchGetAccountNFTs() {
  const res: OwnedNftsResponse | null = await fetchGetApi(
    "/accounts/collections"
  );
  return res;
}

// NFT Metadata API
export async function fetchGetNFTMetadata(address: string, tokenId: string) {
  const res: NFTDetail | null = await fetchGetApi(
    `/assets?address=${address}&tokenId=${tokenId}`,
    { cache: "no-store" }
  );
  return res;
}
