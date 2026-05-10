import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.email) {
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name ?? null,
                image: (profile as any).picture ?? null,
                role: "MEMBER",
              },
            });
          }

          token.id = user.id;
          token.role = user.role;
          token.email = user.email;
          token.name = user.name;
        } catch (err) {
          console.error("JWT callback error:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).role = token.role ?? "MEMBER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});