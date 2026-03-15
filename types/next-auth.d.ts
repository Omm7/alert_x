import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      branch?: string;
      collegeName?: string;
      graduationYear?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
    branch?: string;
    collegeName?: string;
    graduationYear?: number;
  }
}
