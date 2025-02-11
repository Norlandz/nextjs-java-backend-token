'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/model/post/Post';

const postList = [
  {
    id: 1,
    title: 'My First Post',
    content: "dummy data, not current user's posts.",
    username: 'NoOne',
    creationTime: new Date(),
  },
  {
    id: 2,
    title: 'Another Post - Learning React',
    content: "dummy data, not current user's posts.",
    username: 'NoOne',
    creationTime: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
  },
  {
    id: 3,
    title: 'MUI is Great!',
    content: "dummy data, not current user's posts.",
    username: 'NoOne',
    creationTime: new Date(new Date().setDate(new Date().getDate() - 2)), // Two days ago
  },
];

export default function UserForumPostListPanel() {
  const [posts, setPosts] = useState<Post[]>(postList);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // @request
        const res = await fetch('/api/posts'); // Your API endpoint (Next.js API route or external API)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (e) {
        // setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Dashboard</h1>
        <div>loading ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Dashboard</h1>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1>Forum Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>{JSON.stringify(post)}</div>
      ))}
    </div>
  );
}
