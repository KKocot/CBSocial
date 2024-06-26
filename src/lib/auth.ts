import { AuthOptions } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import { DefaultSession } from "next-auth";
import connectMongoDB from "./mongodb";
import Whitelist from "@/models/whitelist";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },

    async signIn({ profile }) {
      try {
        await connectMongoDB();
        const ifUserExists = await Whitelist.findOne({
          idDiscord: (profile as DiscordProfile).id,
        });
        if (ifUserExists) {
          return true;
        }
      } catch (err) {
        return false;
      }

      return false;
    },

    session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
  },
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string;
  }
}
