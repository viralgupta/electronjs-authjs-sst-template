import { ApiHandler } from "sst/node/api";
import createResourceOnUploadHandler from "@backend/functions/createResourceOnUpload";


export const createResourceOnUpload = ApiHandler(async (evt) => {
  await createResourceOnUploadHandler(evt)

  return {
    statusCode: 200,
  };
});