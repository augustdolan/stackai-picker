import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
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
        const authResponse = await fetch(`${process.env.STACKAI_BACKEND_URL}/auth/v1/token?grant_type=password`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email || process.env.DEFAULT_EMAIL,
            password: credentials.password || process.env.DEFAULT_PASSWORD, // these defaults likely do not work
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
        console.log("sessionParsed", parsedOrgInfo);

        return { ...parsedAuth, org_id: parsedOrgInfo.org_id };
      }
    })
  ],
})
