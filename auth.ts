import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ user, token }) {
      if (user) {
        // @ts-expect-error needed to extend the session, no quick way to extend type
        token.user = { id: user.user.id }
        // @ts-expect-error needed to extend the session, no quick way to extend type
        token.accessToken = user.access_token
        // @ts-expect-error needed to extend the session, no quick way to extend type
        token.orgId = user.org_id
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-expect-error needed to extend the session, no quick way to extend type
      session.orgId = token.orgId;
      // @ts-expect-error needed to extend the session, no quick way to extend type
      session.user = { id: token.user.id };
      // @ts-expect-error needed to extend the session, no quick way to extend type
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
