import Credentials from "@auth/express/providers/credentials";
import { AuthConfig as AuthConfigType } from "@auth/core";
import { user as UserSchema } from "@db/schema"
import { eq } from "drizzle-orm"
import db from "@db/db"

const AuthConfig = {
  providers: [
    Credentials({
      credentials: {
        phone_number: { label: "Phone Number", type: "string" },
        otp: { label: "OTP", type: "number" },
      },
      async authorize({ phone_number, otp }) {

        const user = await db.transaction(async (tx) => {
          const tUser = await tx.query.user.findFirst({
            where: (user, { eq, and }) =>
              and(
                eq(user.phone_number, phone_number as string),
                eq(user.otp, otp as number)
              ),
          });

          if (!tUser) return null;

          await tx.update(UserSchema).set({
            otp: null,
          }).where(eq(UserSchema.id, tUser.id));

          return tUser;
        })

        if (!user) return null;

        else return {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin
        }
      },
    }),
  ],
  callbacks: {
    redirect({ url }) {
      return url;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/"
  },
  basePath: "/auth",
  // redirectProxyUrl: "http://localhost:5173/",
} satisfies AuthConfigType;

export default AuthConfig;