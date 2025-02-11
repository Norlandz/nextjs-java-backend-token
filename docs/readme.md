## `middleware.ts` vs `useSession()` when using NextAuth with custom backend for authentication

### Situation

Im using **Nextjs** as the frontend, with **Java** as backend.

- Nextjs is responsible for client side rendering & server side rendering. \
  But **Nextjs is not directly accessing any of the backend database**. \
  It only communicates with Java Backend.

- **Java is responsible for all the backend stuff**. \
  Including issuing and verifing **access token, refresh token**, or any security related problems. \
  (Or database accessing.)

### Intention

- When the user login, Nextjs get **access token & refresh token** from Java.
- When the user needs to get any personal secured info, Nextjs **sends the access token to Java** and gets the info.

### Security Tech

- **NextAuth** for managing the user session.
- **CredentialsProvider** for the custom Java backend, (instead of GoogleProvider / GithubProvider).

### Code Outline

- `src/app/user/current/dashboard/page.tsx` is the page that is **protected by `useSession()`**, the code can get access token from the session, and can send access token for personal info if needed.
- `src/app/user/current/profile/page.tsx` is the page that is **protected by `useSession()`**, the code can get access token from the session, and can send access token for personal info if needed.
- `src/app/api/auth/[...nextauth]/route.ts` is responsible for **user login and receiving token and check token expiration and send refresh token**.
- `src/actions/user-auth.ts` is **mocking the backend**, sending back access token & refresh token to frontend.

### Questions

- note that: **`Nextjs is not directly accessing any of the backend database`**, \
  I use Java as the backend.

- `src/middleware.ts` what is this file doing here?

  - why do i need `middleware.ts`? **isnt everything well protected by `useSession()` already?**
  - what is the difference **between `useSession()` & `middleware.ts` for protection**?

    - For testing purpose, I config that `export const config = {   matcher: ['/user/current/setting'], };`, \
      and the functions inside `middleware.ts` only get triggered when i access `/user/current/setting`. So it does protect the webpage.

      But, is there any reason I would config that? \
      again `` isnt everything well protected by `useSession()` already? ``

  - what does the `const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });` in `src/middleware.ts` do?

    - I learnt that `const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });` is merely getting \
      the token I received in the `CredentialsProvider`. \
      Doesnt that mean `middleware.ts` has the same level of security as `useSession()`?

  - what does the `authorized: ({ token, req }) => {` in `src/middleware.ts` do?
    - Again, I can get the same token in `useSession()` right? \
      Then why cant I just authorize by `useSession()`?

- If `src/middleware.ts` serves no point in my case. \
  Should I leave it as is, or remove it, or how to change it?
- If `src/middleware.ts` does play a role in my case. \
  Could you please **explain the workflow of the code/data/token**? \
  How should I write/implement it **correctly**?

### Learning from following 2 resources (they are good)

- Next-Auth Login Authentication Tutorial with Next.js App Directory - YouTube \
  https://www.youtube.com/watch?v=w2h54xz6Ndw \
  Dave Gray

- NextJs NextAuth with your own authentication backend | by Ægir Máni Hauksson | Medium \
  https://sourcehawk.medium.com/next-auth-with-a-custom-authentication-backend-12c8f54ed4ce \
  sourcehawk

### Code Details

- https://github.com/Norlandz/nextjs-java-backend-token

- `src/app/api/auth/[...nextauth]/route.ts`

  ```ts
  import NextAuth from 'next-auth';
  import CredentialsProvider from 'next-auth/providers/credentials';
  import { login, refresh } from '@/actions/user-auth';
  import type { AuthOptions, User, UserObject, AuthValidity, BackendAccessJWT, BackendJWT, DecodedJWT } from 'next-auth';
  import type { JWT } from 'next-auth/jwt';
  import { jwtDecode } from 'jwt-decode';
  import dayjs from 'dayjs';

  async function refreshAccessToken(nextAuthJWT: JWT): Promise<JWT> {
    try {
      // @request
      // Get a new access token from backend using the refresh token
      const res = await refresh(nextAuthJWT.data.tokens.refresh);
      const accessToken: BackendAccessJWT = await res.json();

      if (!res.ok) throw accessToken;
      const { exp }: DecodedJWT = jwtDecode(accessToken.access);

      // Update the token and validity in the next-auth object
      nextAuthJWT.data.validity.valid_until = exp;
      nextAuthJWT.data.tokens.access = accessToken.access;

      return { ...nextAuthJWT };
    } catch (error) {
      console.debug(error);
      return {
        ...nextAuthJWT,
        error: 'RefreshAccessTokenError',
      };
    }
  }

  export const authOptions: AuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Email and Password',
        credentials: {
          email: { label: 'Email', type: 'email', placeholder: 'nl@outlook.com' },
          password: { label: 'Password', type: 'password', placeholder: 'asdf' },
        },
        async authorize(credentials, req) {
          if (credentials == null) return null;
          if (credentials.email == null) return null;
          if (credentials.password == null) return null;

          // @request
          const response = await login(credentials.email, credentials.password);
          if (!response.ok) {
            return null;
          }

          let tokens: BackendJWT;
          try {
            tokens = await response.json();
            console.log('>jwt> [...nextauth]/route.tsx > AuthOptions > CredentialProvider > authorize', tokens);
          } catch (error) {
            console.error('Error parsing JSON response:', error);
            return null; // Authentication failed (parsing error)
          }

          const access: DecodedJWT = jwtDecode(tokens.access);
          const refresh: DecodedJWT = jwtDecode(tokens.refresh);
          // Extract the user from the access token
          const user: UserObject = {
            name: access.name, // @test null, cuz didnt pass in jwt
            email: access.email,
            id: access.id,
          };
          // Extract the auth validity from the tokens
          const validity: AuthValidity = {
            valid_until: access.exp,
            refresh_until: refresh.exp,
          };

          // Return the object that next-auth calls 'User' (which we've defined in next-auth.d.ts)
          return {
            id: refresh.jti, // User object is forced to have a string id so use refresh token id
            tokens: tokens,
            user: user,
            validity: validity,
          };
        },
      }),
    ],
    session: {
      strategy: 'jwt',
      maxAge: 8, // 8s to clear the frontend cookie... // @mark[token time]
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({ token, user, account, profile, session }) {
        console.log('>jwt> [...nextauth]/route.tsx > AuthOptions > callbacks > jwt', token, user);

        // Initial signin contains a 'User' object from authorize method
        if (user && account) {
          console.debug('Initial signin');
          return { ...token, data: user };
        }

        // The current access token is still valid
        console.log('jwt() access', dayjs(token.data.validity.valid_until * 1000).format('HH:mm:ss.SSS'));
        if (Date.now() < token.data.validity.valid_until * 1000) {
          console.debug('Access token is still valid');
          return token;
        }

        // The current access token has expired, but the refresh token is still valid
        console.log('jwt() refresh', dayjs(token.data.validity.refresh_until * 1000).format('HH:mm:ss.SSS'));
        if (Date.now() < token.data.validity.refresh_until * 1000) {
          console.debug('Access token is being refreshed');
          return await refreshAccessToken(token);
        }

        // The current access token and refresh token have both expired
        // This should not really happen unless you get really unlucky with
        // the timing of the token expiration because the middleware should
        // have caught this case before the callback is called
        console.debug('Both tokens have expired');
        return { ...token, error: 'RefreshTokenExpired' } as JWT;
        //? should i log the user out?
      },
      async session({ session, token, user }) {
        console.log('>jwt> [...nextauth]/route.tsx > AuthOptions > callbacks > session', token, session, user);

        session.user = token.data.user;
        session.validity = token.data.validity;
        session.error = token.error;
        return session;
      },
      async redirect({ url, baseUrl }) {
        return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl);
      },
    },
  };

  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };
  ```

- `src/middleware.ts`

  ```ts
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
  ```

### Tech version

```
"next": "15.1.6",
"next-auth": "^4.24.11",
"react": "^19.0.0",
```
