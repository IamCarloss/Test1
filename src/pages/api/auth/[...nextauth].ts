import User from "@/models/schemas/userSchema";
import connectDB from "@/utils/MongoDB/dbConnection";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 12 * 60 * 60,
  },
  jwt: {
    maxAge: 12 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "dantek",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req: any) {
        // Aquí deberías verificar las credenciales contra tu base de datos o API
        await connectDB();

        const user: any = await User.findOne({
          username: credentials.username,
        });

        if (!user) return null;

        let validation = false;

        await bcrypt
          .compare(credentials.password, user.passwordHash)
          .then(function (result) {
            if (result) {
              validation = true;
            }
          });

        if (validation) {
          const data: any = {
            _id: user._id,
          };

          return data;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token._id) {
        session.user._id = token._id;
      }

      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token._id = user._id;
      }

      return token;
    },
  },
});
