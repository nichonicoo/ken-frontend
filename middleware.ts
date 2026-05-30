export { default } from "next-auth/middleware";

// Routes yang butuh login
export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/orders/:path*",
  ],
};