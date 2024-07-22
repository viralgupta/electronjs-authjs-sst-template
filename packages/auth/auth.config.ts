import Credentials from "@auth/express/providers/credentials";
import db from "@db/db"
const AuthConfig = {
  providers: [
    Credentials({
      credentials: {
        phone_number: { label: "Phone Number", type: "string" },
        otp: { label: "OTP", type: "number" },
      },
      async authorize({ phone_number, otp }) {
        const user = await db.query.user.findFirst({
          where: (user, { eq, and }) => and(eq(user.phone_number, phone_number as string), eq(user.otp, otp as number))
        })

        if(!user) return null;

        else return {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin
        }
      },
    }),
  ],
}

export default AuthConfig;