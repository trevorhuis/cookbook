import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { json, type LoaderFunctionArgs } from "react-router/node";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filename = url.searchParams.get("file");

  const Bucket = process.env.BUCKET_NAME!;
  const Key = filename as string;

  const post = await getSignedUrl(S3, new PutObjectCommand({ Bucket, Key }), {
    expiresIn: 3600,
  });

  return json({ post, key: Key });
}
