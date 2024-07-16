import { ApiHandler } from "sst/node/api";
import createResourceOnUploadHandler from "@backend/functions/createResourceOnUpload";
import removeResourceOnDeleteHandler from "@backend/functions/removeResourceOnDelete";


export const createResourceOnUpload = ApiHandler(async (evt) => {
  await createResourceOnUploadHandler(evt);

  return {
    statusCode: 200,
  };
});


export const removeResourceOnDelete = ApiHandler(async (evt) => {
  await removeResourceOnDeleteHandler(evt);

  return {
    statusCode: 200,
  };
});