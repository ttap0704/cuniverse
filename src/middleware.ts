import { NextRequest, NextResponse } from "next/server";
import { SERVER_NAME } from "../constants";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const path = request.url.replace(SERVER_NAME, "");
  requestHeaders.set("x-url", path);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
