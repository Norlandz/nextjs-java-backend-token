'use client';

import Link from 'next/link';

export default function App() {
  return (
    <div>
      <Link href="/home">/home</Link>
      <br />
      <Link href="/about">/about</Link>
      <br />
      <Link href="/user/current/dashboard">/user/current/dashboard</Link>
      <br />
      <Link href="/user/current/profile">/user/current/profile</Link>
      <br />
      <Link href="/user/current/forumPost">/user/current/forumPost</Link>
      <br />
      <Link href="/user/current/setting">/user/current/setting</Link>
    </div>
  );
}
