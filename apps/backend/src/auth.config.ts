import { AuthConfig as AuthConfigType } from "@auth/core";
import Credentials from "@auth/core/providers/credentials";
import { Config } from "sst/node/config";

const AuthConfig = {
  secret: Config.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        Email: { label: "Email", type: "string" },
        Password: { label: "Password", type: "string" },
      },
      async authorize({ Email, Password }) {

        // add custom backend authorization logic here

        if (Email === "demo@email.com" && Password === "password") {
          return {
            id: "123",
            email: "demo@email.com",
            name: "Demo User",
          }
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      const newurl = `${baseUrl}/authcallbackoverride?callback=${url}`
      return newurl;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/"
  },
  basePath: "/auth",
} satisfies AuthConfigType;

export default AuthConfig;