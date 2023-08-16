import { NextRequest, NextResponse } from "next/server";
import { base64ToFile } from "@/utils/tools";
import { INFURA_IPFS_SUB_DOMAIN } from "../../../../../../constants";
import fs from "fs";

export async function POST(request: NextRequest) {
  let pass = false,
    message = "",
    data: null | string = null;

  const body = await request.formData();
  const uploadData = body.get("file");
  const fileType = body.get("fileType");
  if (uploadData && fileType) {
    try {
      const projectId = process.env.INFURA_IPFS_KEY;
      const projectSecret = process.env.INFURA_IPFS_KEY_SECRET;
      const auth = `Basic ${Buffer.from(
        `${projectId}:${projectSecret}`
      ).toString("base64")}`;
      const headers = new Headers();
      headers.append("Authorization", auth);
      const formdata = new FormData();
      formdata.append("file", uploadData);

      const requestOptions = {
        method: "POST",
        headers,
        body: formdata,
      };

      const response = await fetch(
        "https://ipfs.infura.io:5001/api/v0/add",
        requestOptions
      );

      const responseJson = await response.json();

      if (responseJson["Hash"] && responseJson["Hash"].length > 0) {
        data = `https://cuniverse.infura-ipfs.io/ipfs/${responseJson["Hash"]}`;
        pass = true;
      }
    } catch (err) {
      console.log("err:", err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
