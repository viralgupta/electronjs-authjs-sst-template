import { z } from "zod";

export const createResourceOnUploadHandlerType = z.object({
  name: z.string().max(100),
  description: z.string().optional(),
  key: z.string(),
})

export const removeResourceOnDeleteHandlerType = z.string();