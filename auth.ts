import NextAuth from "next-auth"
import Twitter from "next-auth/providers/twitter"
import { User as DefaultUser } from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & {
      twitterId?: string;
    };
  }

  interface User {
    twitterId?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
  providers: [Twitter],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.twitterId = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.twitterId) {
        session.user.twitterId = token.twitterId as string;
      }
      return session;
    },
  }
})