'use client';

import CreateButton from '@/components/create-button';
import Post from '@/components/post';
import { Community } from '@/enums';
import { Post as IPost } from '@/interfaces';
import { getCookie } from 'cookies-next';
import React from 'react';
import useSWR from 'swr';

const Page: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [community, setCommunity] = React.useState<Community | ''>('');

  const {
    data: posts,
    mutate,
    isLoading,
  } = useSWR<IPost[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/post/me?q=${query}${community ? `&community=${community}` : ''}`,
    async (url: string) => {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('access_token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      return response.json();
    },
  );

  const handleDelete = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie('access_token')}` },
    });

    if (response.ok) {
      mutate();
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-8">
      <div className="flex justify-between gap-5">
        <input
          type="text"
          className="peer rounded-2 w-full border border-green-100 px-3.5 py-2.5"
          placeholder="Search"
        />
        <div className="flex shrink-0 gap-2.5 peer-focus:hidden">
          <select
            className="font-ibm rounded-2 items-center px-3.5 py-2.5 text-sm font-semibold"
            value={community}
            onChange={(e) => setCommunity(e.target.value as Community)}
          >
            <option value="">Community</option>
            <option value={Community.HISTORY}>History</option>
            <option value={Community.FOOD}>Food</option>
            <option value={Community.OTHER}>Other</option>
          </select>
          <CreateButton onCreate={mutate} />
        </div>
      </div>
      <div className="rounded-3 divide-y divide-gray-100 border border-gray-100 bg-white">
        {posts && posts.map((post) => <Post key={post.id} post={post} onUpdate={mutate} onDelete={handleDelete} />)}
      </div>
    </div>
  );
};

export default Page;
