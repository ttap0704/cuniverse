import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let pass = false,
    message = "",
    data: null | string = null;

  const body = await request.formData();
  const uploadData = body.get("file");
  const fileType = body.get("fileType");
  if (fileType) {
    try {
      const projectId = process.env.INFURA_IPFS_KEY;
      const projectSecret = process.env.INFURA_IPFS_KEY_SECRET;
      const auth = `Basic ${Buffer.from(
        `${projectId}:${projectSecret}`
      ).toString("base64")}`;
      const headers = new Headers();
      headers.append("Authorization", auth);
      const formdata = new FormData();
      if (uploadData) formdata.append("file", uploadData);

      const requestOptions = {
        method: "POST",
        headers,
        body: formdata,
      };

      const requestURI = "https://ipfs.infura.io:5001/api/v0/add";

      const response = await fetch(requestURI, requestOptions);
      console.log({ "mint response": response });
      const responseJson = await response.json();

      if (responseJson["Hash"] && responseJson["Hash"].length > 0) {
        data = responseJson["Hash"];
        pass = true;
      }
    } catch (err) {
      console.log("err:", err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
