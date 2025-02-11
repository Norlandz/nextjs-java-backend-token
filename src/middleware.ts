import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    // Try to extract the token stored by NextAuth in a cookie.
    // NEXTAUTH_SECRET is used here to verify the JWT that NextAuth created.
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('>jwt> middleware.ts > withAuth > middleware', token);
    // If there's no token, the user isn't authenticated.
    const baseUrl = req.nextUrl.origin;
    if (!token) {
      return NextResponse.redirect(`${baseUrl}/api/auth/signin`);
    }
    // Check if the user is authenticated
    if (token && Date.now() >= token.data.validity.refresh_until * 1000) {
      // Redirect to the login page
      const response = NextResponse.redirect(`${baseUrl}/api/auth/signin`);
      // Clear the session cookies
      response.cookies.set('next-auth.session-token', '', { maxAge: 0 });
      response.cookies.set('next-auth.csrf-token', '', { maxAge: 0 });
      return response;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        //         // Check if the user has the required role (example)
        //         if (token?.role === "admin") {
        //           return true; // User is authorized
        //         }
        //         return false; // User is not authorized
        console.log('>jwt> middleware.ts > withAuth > callbacks > authorized', token);
        return Boolean(token); // if token exists, the user is authenticated
      },
    },
  }
);

export const config = {
  matcher: ['/user/current/setting'],
};
