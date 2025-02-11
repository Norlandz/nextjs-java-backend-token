'use client';

import { UserObject } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function UserDashboardPanel() {
  const { data: session, status, update } = useSession();

  if (!session) {
    if (status === 'loading') {
      return (
        <div>
          <h1>Dashboard</h1>
          <div>loading ...</div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Dashboard</h1>
          <div>not signed in</div>
          <button onClick={() => signIn()}>Sign in</button>
        </div>
      );
    }
  }
  
  const user: UserObject = session.user;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>{JSON.stringify(user)} is signed in</div>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
