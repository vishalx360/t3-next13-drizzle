import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { users } from "drizzle/schema";
import { eq } from "drizzle-orm";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { drizzleDB } from "@/../drizzle";
import { env } from "@/env.mjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const options: NextAuthOptions = {
  adapter: DrizzleAdapter(drizzleDB),
  secret: env.NEXTAUTH_SECRET,
  providers: [
    // oauth providers
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};
