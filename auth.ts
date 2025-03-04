import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { User as DefaultUser } from "next-auth";
import { config } from "dotenv";

config();

// Extend the default User and Session types
declare module "next-auth" {
  interface CustomUser extends DefaultUser {
    twitterId?: string;
    twitterUsername?: string;
  }

  interface Session {
    user: CustomUser & {
      twitterId?: string;
      twitterUsername?: string;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Twitter({
      clientId: process.env.NEXT_AUTH_TWITTER_ID!,
      clientSecret: process.env.NEXT_AUTH_TWITTER_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.twitterId = account.providerAccountId;
        token.twitterUsername = profile?.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.twitterId) {
        session.user.twitterId = token.twitterId as string;
      }
      if (token.twitterUsername) {
        session.user.twitterUsername = token.twitterUsername as string;
      }
      return session;
    },
  },
});