import { NextRequest, NextResponse } from "next/server";
import S3 from "aws-sdk/clients/s3";

export async function POST(request: NextRequest, response: NextResponse) {
  let pass = false,
    message = "",
    data = null;

  try {
    // S3 설정
    const s3 = new S3({
      region: "ap-northeast-2",
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    });

    const body: APIRequestBody = await request.json();

    // Url 수정 권한 얻기
    const preSignedUrl = await s3.getSignedUrl("putObject", {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: body.data.name,
      ContentType: body.data.type,
      Expires: 5 * 60,
    });

    data = preSignedUrl;
    pass = true;
  } catch (err) {
    console.log(err);
    message = "업로드 중 오류가 발생하였습니다.";
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
