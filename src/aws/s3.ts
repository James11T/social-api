import AWS from "aws-sdk";

const { WEB_DOMAIN, MEDIA_SUBDOMAIN, AWS_S3_ACCESS_KEY_ID, AWS_S3_ACCESS_KEY } =
  process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
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
  bucket = `${MEDIA_SUBDOMAIN}.${WEB_DOMAIN}`
) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: file
  };

  return await s3.upload(params).promise();
};

export { uploadFile };
