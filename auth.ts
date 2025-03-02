import NextAuth from "next-auth"
import Twitter from "next-auth/providers/twitter"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db";




 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
  providers: [Twitter],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  }
})