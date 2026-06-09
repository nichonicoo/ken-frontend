// export { default } from "next-auth/middleware";

// // Routes yang butuh login
// export const config = {
//   matcher: [
//     "/account/:path*",
//     "/checkout/:path*",
//     "/orders/:path*",
//   ],
// };

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/orders/:path*",
  ],
};