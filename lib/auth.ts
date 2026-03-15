import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("[AUTH] Missing email or password");
          return null;
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();
        console.log("[AUTH] Attempting login for:", normalizedEmail);

        try {
          const user = await prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: "insensitive" } },
          });

          if (!user) {
            console.log("[AUTH] User not found:", normalizedEmail);
            return null;
          }

          console.log("[AUTH] User found:", user.email);
          console.log("[AUTH] Comparing password...");
          const validPassword = await bcrypt.compare(credentials.password, user.password);

          if (!validPassword) {
            console.log("[AUTH] Password mismatch for user:", normalizedEmail);
            return null;
          }

          console.log("[AUTH] Password match successful, creating session for:", user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            branch: user.branch,
            collegeName: user.collegeName,
            graduationYear: user.graduationYear,
          };
        } catch (error) {
          console.error("[AUTH] Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: "USER" | "ADMIN" }).role;
        token.branch = (user as { branch?: string }).branch;
        token.collegeName = (user as { collegeName?: string }).collegeName;
        token.graduationYear = (user as { graduationYear?: number }).graduationYear;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
        session.user.branch = token.branch as string;
        session.user.collegeName = token.collegeName as string;
        session.user.graduationYear = token.graduationYear as number;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
