import AWS from "aws-sdk";
import { env } from "../env/server.mjs";

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
}); // TODO: extract this to an export

export default s3;
