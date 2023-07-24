import Web3 from "web3";
import { SERVER_NAME } from "../../../next-react-state-management/constants";

function setHeader() {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  // Wallet 연동 시 저장한 web3-token 가져와서 header에 추가
  const web3Token = localStorage.getItem("web3-token");
  if (web3Token) {
    headers["Authorization"] = `Bearer ${web3Token}`;
  }

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
      balance: wei != "0." ? wei.slice(0, 6) : "0",
    };
  }

  console.log(finalResponse);

  return finalResponse;
}
