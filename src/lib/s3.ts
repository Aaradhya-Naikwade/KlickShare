import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export async function uploadToS3(buffer: Buffer, key: string, mimeType: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: "public-read", // make public; remove if you want private
  };

  const data = await s3.upload(params).promise();
  return data.Location; // URL of uploaded file
}

export async function deleteFromS3(key: string) {
  const params = { Bucket: BUCKET_NAME, Key: key };
  await s3.deleteObject(params).promise();
}
