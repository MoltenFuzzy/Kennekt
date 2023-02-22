import AWS from "aws-sdk";
import { env } from "../env/server.mjs";

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID_TEST,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY_TEST,
  region: env.AWS_REGION_TEST,
});
export default s3;
