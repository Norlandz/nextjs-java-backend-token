'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { UserObject } from 'next-auth';

export default function UserProfilePanel() {
  const sessionData = useSession();
  console.log(sessionData);
  const session = sessionData.data;
  const status = sessionData.status;

  if (!session) {
    if (status === 'loading') {
      return (
        <div>
          <h1>Profile</h1>
          <div>loading ...</div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Profile</h1>
          <div>not signed in</div>
          <button onClick={() => signIn()}>Sign in</button>
        </div>
      );
    }
  }
  const user: UserObject = session.user;

  return (
    <div>
      <h1>Profile</h1>
      <div>{JSON.stringify(user)} is signed in</div>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
