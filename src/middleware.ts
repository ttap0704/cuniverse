import { NextRequest, NextResponse } from "next/server";
import {
  ACCOUNT_API,
  ACCOUNT_PAGES,
  SERVER_NAME,
  SIGN_TEXT,
} from "../constants";
import { verifyMessage } from "ethers";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const path = request.url.replace(SERVER_NAME, "");
  requestHeaders.set("X-Url", path);

  console.log("middleware path:", path);

  const token = request.cookies.get("web3-token")?.value;
  const walletAddress = request.cookies.get("wallet-address")?.value;
  const loginTime = request.cookies.get("login-time")?.value;

  let response: NextResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  let logout = false;
  if (!request.nextUrl.pathname.startsWith("/api")) {
    // web3-token과 address비교하여 값이 다르다면 로그인 유지에 필요한 cookies 만료처리
    if (
      (token && !walletAddress && !loginTime) ||
      (!token && walletAddress && !loginTime) ||
      (!token && !walletAddress && loginTime)
    ) {
      logout = true;
    } else if (token && walletAddress && loginTime) {
      const address = await verifyMessage(
        SIGN_TEXT + new Date(Number(loginTime)).toLocaleString(),
        token
      );
      if (address != walletAddress) logout = true;
    } else if (
      !token &&
      !walletAddress &&
      !loginTime &&
      ACCOUNT_PAGES.includes(path)
    ) {
      logout = true;
    }

    if (logout) {
      // 로그인 유저 전용페이지에 접근할 때에는 Root Page로 Reirect
      const startPath = path.split("/")[1];

      if (ACCOUNT_PAGES.includes(startPath)) {
        response = NextResponse.redirect(new URL("/", request.url), {
          headers: requestHeaders,
        });
      }
    }
  } else {
    // API는 Account 전용 경로만 검증
    if (ACCOUNT_API.includes(path)) {
      let logout = false;
      if (!token || !walletAddress || !loginTime) {
        logout = true;
      } else if (token && walletAddress && loginTime) {
        // web3-token과 address비교하여 값이 다르다면 로그인 유지에 필요한 cookies 만료처리
        const address = await verifyMessage(
          SIGN_TEXT + new Date(Number(loginTime)).toLocaleString(),
          token
        );
        if (address != walletAddress) logout = true;
      }

      if (logout) {
        // 로그인 유저 전용페이지에 접근할 때에는 Root Page로 Reirect
        response = NextResponse.redirect(new URL("/", request.url), {
          headers: requestHeaders,
        });
      }
    }
  }

  if (logout) {
    // 로그아웃 처리 시, 클라이언트에 헤더 전달함으로써 클라이언트 로그아웃 처리
    response.headers.set("X-Account-State", "logout");

    // 로그인 유지 쿠키 만료처리
    response.cookies.set("web3-token", "", {
      expires: new Date("1001/01/01"),
    });
    response.cookies.set("wallet-address", "", {
      expires: new Date("1001/01/01"),
    });
  }

  return response;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
