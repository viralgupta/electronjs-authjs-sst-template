import { z } from "zod";
import { createPutSignedURLType } from "../api/miscellaneous";

export const createResourceOnUploadHandlerType = createPutSignedURLType.omit({
  type: true,
  extension: true,
}).extend({
  key: z.string(),
})

export const removeResourceOnDeleteHandlerType = z.string();