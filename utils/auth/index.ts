import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createOrUpdateUser } from "@/utils/firebase/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GoogleProvider],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user) {
        await createOrUpdateUser({
          name: user.name,
          email: user.email
        });
      }
      return true;
    },
  }
})