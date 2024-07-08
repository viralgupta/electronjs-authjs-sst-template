import Credentials from "@auth/express/providers/credentials";

const AuthConfig = {
  providers: [
    Credentials({
      credentials: {
        phone_number: { label: "Phone Number", type: "number" },
        otp: { label: "OTP", type: "number" },
      },
      async authorize({ phone_number, otp }) {
        console.log(phone_number, otp);

        return {
          id: "1234",
          user_name: "John Doe",
          isAdmin: false,
        };
      },
    }),
  ],
}

export default AuthConfig;