import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken: string
    orgId: string
    user: {
      id: string
    }
  }
}
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    user: {
      id: string
    },
    access_token: string,
    org_id: string
  }
  interface Token {
    user: {
      id: string
    },
    access_token: string,
    orgId: string
  }
  interface Session {
    orgId: string,
    accessToken: string,
    user: {
      id: string
    }
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    // protect pages with auth
    async authorized({ auth }) {
      return Boolean(auth);
    },
    jwt({ user, token }) {
      if (user) {
        token.user = { id: user.user.id }
        token.accessToken = user.access_token
        token.orgId = user.org_id
      }
      return token;
    },
    async session({ session, token }) {
      session.orgId = token.orgId;
      // @ts-expect-error needed to extend the session, no quick way to extend type
      session.user = { id: token.user.id };
      session.accessToken = token.accessToken;
      return session;
    }
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const authResponse = await fetch(`${process.env.STACKAI_AUTH_BACKEND_URL}/auth/v1/token?grant_type=password`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            gotrue_meta_security: {},
          }),
          headers: {
            "Content-Type": "application/json",
            "Apikey": process.env.ANON_KEY || "API KEY NOT SET",
          }
        })
        const parsedAuth = await authResponse.json()
        if (!parsedAuth.user) {
          throw new Error("user not found");
        }

        // could not tuck into session callback, as it was called on every state change
        const orgIdResponse = await fetch(`${process.env.STACKAI_BACKEND_URL}/organizations/me/current`,
          {
            headers: {
              "Authorization": `Bearer ${parsedAuth.access_token}`
            }
          })
        const parsedOrgInfo = await orgIdResponse.json()

        return { ...parsedAuth, org_id: parsedOrgInfo.org_id };
      }
    })
  ],
})
