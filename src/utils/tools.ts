import { fetchUploadS3 } from "./api";

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

  console.log(file.name);

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

// wallet/contract adderss 줄이기
export function getShortAddress(address: string) {
  if (address.length <= 6) return address;
  return address.slice(0, 6) + "..." + address.slice(address.length - 4);
}

// 글자수 체크 return string
export function checkMaxLength(length: StringOrNumber, text: string) {
  if (Number(length) < text.length) return `${length}자 이하로 입력해주세요.`;
  return "";
}

// base64를 이미지 파일로 변환
export function base64ToFile(dataurl: string, filename: string) {
  const arr = dataurl.split(",");
  if (arr.length > 0) {
    const mime = arr[0].match(/:(.*?);/);
    const mimeType = mime ? mime[1] : "";
    const bstr = atob(arr[1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const file = new File([u8arr], filename + `.${mimeType.split("/")[1]}`, {
      type: mimeType,
    });
    return file;
  } else return null;
}
