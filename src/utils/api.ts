import Web3 from "web3";
import { SERVER_NAME } from "../../../next-react-state-management/constants";
import { S3_IMAGES_URL } from "../../constants";

function setHeader() {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  return headers;
}

async function fetchGetApi(url: string) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "GET",
    headers: { ...setHeader() },
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchPostApi(body: object, url: string) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "POST",
    headers: { ...setHeader() },
    body: JSON.stringify({ time: new Date().toISOString(), data: body }),
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchPutApi(body: object, url: string) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "PUT",
    headers: { ...setHeader() },
    body: JSON.stringify({ time: new Date().toISOString(), data: body }),
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchDeleteApi(url: string) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "DELETE",
    headers: { ...setHeader() },
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

// Get Account Info API
export async function fetchGetAccountInfo() {
  const res: AccountInfoReponse | null = await fetchGetApi("/accounts");
  let finalResponse: Account | null = null;

  // 유저가 있다면 Query Key ['user'] 최종 업데이트
  if (res && window.ethereum) {
    const web3 = new Web3(window.ethereum);
    const balance = await web3.eth.getBalance(res.address);
    const wei = web3.utils.fromWei(balance, "ether");

    finalResponse = {
      ...res,
      banner: res.banner ? `${S3_IMAGES_URL}/images/${res.banner}` : res.banner,
      balance: wei != "0." ? wei.slice(0, 6) : "0",
    };
  }

  return finalResponse;
}

// S3 이미지 업로드 권한 취득 API
export async function fetchUploadS3(body: object) {
  const res: string = await fetchPostApi(body, "/image/upload");
  return res;
}
