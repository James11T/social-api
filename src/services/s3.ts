import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_IMAGE_BUCKET } =
  process.env;

export const s3 = new S3Client({
  region: "eu-west2",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});

/**
 * Upload a file to AWS S3
 *
 * @param file The file to upload
 * @param key The key (filename) to upload as
 * @param bucket The S3 bucket to upload to
 * @returns A promise of the S3 upload
 */
const uploadFile = async (
  file: Buffer,
  key: string,
  bucket = AWS_S3_IMAGE_BUCKET
) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: file
  };

  const command = new PutObjectCommand(params);
  const res = await s3.send(command);

  return res;
};

export { uploadFile };
