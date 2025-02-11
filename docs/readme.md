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
- `src/app/api/auth/[...nextauth]/route.tsx` is responsible for **user login and receiving token and check token expiration and send refresh token**.
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

### Tech version

```
"next": "15.1.6",
"next-auth": "^4.24.11",
"react": "^19.0.0",
```
