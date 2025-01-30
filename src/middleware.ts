import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = { 
  matcher: ["/dashboard/:path*", "/postedLpos/:path*"],
  skip: ["/api/auth/:path*"], // Allows NextAuth routes to work
};