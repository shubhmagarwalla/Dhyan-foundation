import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || "common"}/v2.0`,
    }),
    Apple({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_PRIVATE_KEY!,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: String(data.user_id),
            email: credentials.email as string,
            accessToken: data.access_token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers, sync user to our backend
      if (account?.provider && account.provider !== "credentials") {
        try {
          await fetch(`${API}/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: account.provider,
              oauth_sub: account.providerAccountId,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
            }),
          });
        } catch {}
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.accessToken = (user as any).accessToken;
      }
      // For OAuth, get our backend JWT
      if (account && account.provider !== "credentials") {
        try {
          const res = await fetch(`${API}/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: account.provider,
              oauth_sub: account.providerAccountId,
              email: token.email,
              name: token.name,
              avatar_url: token.picture,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.access_token;
            token.userId = data.user_id;
            token.profileComplete = data.profile_complete;
          }
        } catch {}
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.userId as string;
      (session as any).accessToken = token.accessToken;
      (session as any).profileComplete = token.profileComplete;
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
