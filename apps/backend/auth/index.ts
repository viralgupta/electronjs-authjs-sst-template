import { ExpressAuth } from "@auth/express";
import AuthConfig from "./auth.config";
import { Config } from "sst/node/config";

function getAuthConfig() {
  process.env.AUTH_SECRET = Config.AUTH_SECRET;

  return ExpressAuth(AuthConfig);
}

export { getAuthConfig };