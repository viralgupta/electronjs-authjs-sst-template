import { type Context } from 'hono'
import { authHandler, initAuthConfig, verifyAuth, type AuthConfig } from "@hono/auth-js"
import { handle } from 'hono/lambda-edge'
import Credentials from "@auth/core/providers/credentials"

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    providers: [
      Credentials({
        credentials: {
          phone_number: { label: "Phone Number", type: "number" },
          otp: {  label: "OTP", type: "number" }
        },
        async authorize({phone_number, otp}) {


          return null;
        }
      })
    ],
  }
}

export { authHandler, initAuthConfig, verifyAuth, handle, getAuthConfig }