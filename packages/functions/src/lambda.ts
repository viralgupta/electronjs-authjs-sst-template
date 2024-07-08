import serverless from "serverless-http"
import { app } from "@backend/core/index";

export const handler = serverless(app);