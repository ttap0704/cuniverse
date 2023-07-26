import Web3 from "web3";
import { fetchUploadS3 } from "./api";

// 현재 네트워크가 어디인지 파악
export async function checkNetwork(web3: Web3, targetNetwork: bigint) {
  return (await web3.eth.getChainId()) == targetNetwork;
}

// IPFS Image 파일 업로드
// export async function uploadImageToIPFS(file: File) {
//   const ipfs = IPFSCreate({
//     url: "http://localhost:5001",
//   });
//   const hash = await ipfs.add(file);
//   console.log(hash);
// }

// S3 Image 업로드
export async function uploadImageToS3(file: File) {
  // 현재 시간으로 Image Name 설정
  const newImageName = `${new Date().getTime()}.${file.name
    .split(".")
    .pop()
    ?.toLocaleLowerCase()}`;

  // 수정 권한 받은 Url Return
  const url = await fetchUploadS3({
    name: `images/${newImageName}`,
    type: file.type,
  });

  // 실제 Url에 이미지 업로드
  const upload = await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (upload.ok) {
    return newImageName;
  } else {
    alert("업로드 중 오류가 발생하였습니다.");
  }
}

// Client측에서 Cookie 설정
export function setCookieInClient(name: string, value: string, expires: Date) {
  document.cookie =
    name + "=" + value + ";" + "expires=" + expires.toUTCString() + ";path=/";
}

// Client측에서 Cookie 설정
export function setCookieExpireInClient(name: string) {
  document.cookie =
    name +
    "=;" +
    "expires=" +
    new Date("1001-01-01 00:00:00").toUTCString() +
    ";path=/";
}
