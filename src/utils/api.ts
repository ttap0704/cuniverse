import { S3_IMAGES_URL, SERVER_NAME } from "../../constants";
import { OwnedNftsResponse } from "alchemy-sdk";
import { uploadImageToS3 } from "./tools";
import { formatEther } from "ethers";
import ethersBrowserProvider from "./ethersBrowserProvider";

export const alertMessage = new Proxy<{
  type: "error" | "success";
  message: string;
}>({ type: "success", message: "" }, {});

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
    alertMessage.type = data.pass ? "success" : "error";
    alertMessage.message = data.message;
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
    alertMessage.type = data.pass ? "success" : "error";
    alertMessage.message = data.message;
  }

  return data.data;
}

async function fetchPostFormdataApi(
  body: FormData,
  url: string,
  options?: RequestInit
) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "POST",
    body,
    ...options,
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alertMessage.type = data.pass ? "success" : "error";
    alertMessage.message = data.message;
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
    alertMessage.type = data.pass ? "success" : "error";
    alertMessage.message = data.message;
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
    alertMessage.type = data.pass ? "success" : "error";
    alertMessage.message = data.message;
  }

  return data.data;
}

// Account Update API
export async function fetchUpdateAccount(body: { data: UpdateAccountRequest }) {
  const res: boolean = await fetchPutApi(body.data, `/account/info`);
  return res;
}

// Account Sales Update API
export async function fetchUpdateAccountSales(body: {
  data: UpdateAccountSalesRequest;
}) {
  const res: boolean = await fetchPutApi(
    body.data,
    `/account/collections/sales`
  );
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
  const res: AccountInfoReponse | null = await fetchGetApi("/account", {
    cache: "no-store",
    credentials: "include",
  });
  let finalResponse: Account | null = null;

  // 유저가 있다면 Query Key ['account'] 최종 업데이트
  if (res && window.ethereum && ethersBrowserProvider.provider) {
    const balance = await ethersBrowserProvider.provider.getBalance(
      res.address
    );
    const wei = formatEther(balance);

    finalResponse = {
      ...res,
      banner: res.banner ? `${S3_IMAGES_URL}/images/${res.banner}` : res.banner,
      profile: res.profile
        ? `${S3_IMAGES_URL}/images/${res.profile}`
        : res.profile,
      balance: wei != "0." ? wei.slice(0, 6) : "0",
      createdAt: new Date(res.createdAt).toLocaleDateString("en-US", {
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
      createdAt: new Date(res.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
    };
  }

  return finalResponse;
}

// 사용자 NFT Collection List
export async function fetchGetCollectorNFTs(address: string) {
  const res: NFTMetadata[] | null = await fetchGetApi(
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
  const res: NFTMetadata[] | null = await fetchGetApi("/account/collections");
  return res;
}

// 사용자 Contract List
export async function fetchGetAccountContracts() {
  const res: ContractDetail[] | null = await fetchGetApi("/account/contracts");
  return res;
}

// 사용자 Contract List
export async function fetchGetCollectorsContracts(address: string) {
  const res: ContractDetail[] | null = await fetchGetApi(
    `/collectors/contracts?address=${address}`
  );
  return res;
}

// NFT Metadata API
export async function fetchGetNFTMetadata(address: string, tokenId: string) {
  const res: NFTDetail | null = await fetchGetApi(
    `/assets?address=${address}&token-id=${tokenId}`,
    { cache: "no-store" }
  );
  return res;
}

// More NFT For Contract API
export async function fetchGetNFTMore(address: string, tokenId: string) {
  const res: NFTMetadata[] | null = await fetchGetApi(
    `/utils/more-nft?address=${address}&token-id=${tokenId}`,
    { cache: "no-store" }
  );
  return res;
}

// GET NFT Transfer Logs  API
export async function fetchGetNFTLogs(address: string, tokenId: string) {
  const res: NFTTransferLog[] | null = await fetchGetApi(
    `/utils/nft-logs?address=${address}&token-id=${tokenId}`,
    { cache: "no-store" }
  );
  return res;
}

// Collction Insert API
export async function fetchCreateConllection(body: {
  data: CreateContractRequest;
}) {
  const res: boolean = await fetchPostApi(body.data, `/account/contracts`);
  return res;
}

// Check Own Contract
export async function fetchCheckOwnContract(contractAddress: string) {
  const res: { name: string; symbol: string } | null = await fetchGetApi(
    `/utils/check-address?contract-address=${contractAddress}`
  );
  return res;
}

// Get Collection Detail
export async function fetchGetCollectionDetail(contractAddress: string) {
  const res: CollectionDetail | null = await fetchGetApi(
    `/collection?address=${contractAddress}`
  );
  return res;
}

// Upload IPFS
export async function fetchUploadIPFS(data: FormData) {
  const res: string | null = await fetchPostFormdataApi(
    data,
    "/account/minting/assets"
  );
  return res;
}

// Get Contract Specific Metadata
export async function fetchGetContractSpecificMetadata(searchParams: string) {
  const res: { [key: string]: any } | null = await fetchGetApi(
    `/utils/contract-metadata?${searchParams}`
  );
  return res;
}

export async function fetchGetEtherPrice() {
  const res: number = await fetchGetApi(`/utils/ether-price`);
  return res;
}

export async function fetchInsertSales(data: SalesDetail) {
  const res: boolean = await fetchPostApi(data, `/account/collections/sales`);
  return res;
}

export async function fetchGetBanners() {
  const res: Banner[] = await fetchGetApi(`/banners`, { cache: "no-store" });
  return res;
}

export async function fetchGetSalesList() {
  const res: NFTMetadata[] = await fetchGetApi(`/assets/sales`, {
    cache: "no-store",
  });
  return res;
}

export async function fetchGetContractsList() {
  const res: ContractDetail[] = await fetchGetApi(`/contracts`, {
    cache: "no-store",
  });
  return res;
}

// // Collction Update API
// export async function fetchUpdateConllection(body: {
//   data: UpdateContractRequest;
// }) {
//   const res: boolean = await fetchPutApi(body.data, `/collections/info`);
//   return res;
// }

// // Collection Image Upload API
// export async function fetchCollectionImageUpload(body: {
//   image: File;
//   key: string;
// }) {
//   const image = await uploadImageToS3(body.image);
//   const res = await fetchUpdateAccount({ data: { [body.key]: image } });

//   return res;
// }
