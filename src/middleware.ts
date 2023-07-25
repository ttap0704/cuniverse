import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_API, ACCOUNT_PAGES, SERVER_NAME } from "../constants";
import Web3Token from "web3-token";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const path = request.url.replace(SERVER_NAME, "");
  requestHeaders.set("x-url", path);

  const token = request.cookies.get("web3-token")?.value;
  const walletAddress = request.cookies.get("wallet-address")?.value;

  let response: NextResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!request.nextUrl.pathname.startsWith("/api")) {
    let logout = false;
    // web3-token과 address비교하여 값이 다르다면 로그인 유지에 필요한 cookies 만료처리
    if ((token && !walletAddress) || (!token && walletAddress)) {
      logout = true;
    } else if (token && walletAddress) {
      const valifiedToken = await Web3Token.verify(token);
      const address = valifiedToken.address;

      if (address != walletAddress) logout = true;
    } else if (!token && !walletAddress && ACCOUNT_PAGES.includes(path)) {
      logout = true;
    }

    if (logout) {
      // 로그인 유저 전용페이지에 접근할 때에는 Root Page로 Reirect
      if (ACCOUNT_PAGES.includes(path)) {
        response = NextResponse.redirect(new URL("/", request.url), {
          headers: requestHeaders,
        });
      }

      response.cookies.set("web3-token", "", {
        expires: new Date("1001/01/01"),
      });
      response.cookies.set("wallet-address", "", {
        expires: new Date("1001/01/01"),
      });
    }
  } else {
    // API는 Account 전용 경로만 검증
    if (ACCOUNT_API.includes(path)) {
      let logout = false;
      if (!token || !walletAddress) {
        logout = true;
      } else if (token && walletAddress) {
        // web3-token과 address비교하여 값이 다르다면 로그인 유지에 필요한 cookies 만료처리
        const valifiedToken = await Web3Token.verify(token);
        const address = valifiedToken.address;

        if (address != walletAddress) logout = true;
      }

      if (logout) {
        // 로그인 유저 전용페이지에 접근할 때에는 Root Page로 Reirect
        response = NextResponse.redirect(new URL("/", request.url), {
          headers: requestHeaders,
        });

        response.cookies.set("web3-token", "", {
          expires: new Date("1001/01/01"),
        });
        response.cookies.set("wallet-address", "", {
          expires: new Date("1001/01/01"),
        });
      }
    }
  }

  return response;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
