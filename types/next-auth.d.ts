import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    authToken: string;
    error?: string;
  }

  interface User {
    authToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    authToken: string;
    refreshToken: string;
    authTokenExpiry: number;
    error?: string;
  }
}