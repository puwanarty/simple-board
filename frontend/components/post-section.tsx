'use client';

import CreateButton from '@/components/create-button';
import PostItem from '@/components/post-item';
import { Community } from '@/enums';
import { Post } from '@/interfaces';
import { getCookie } from 'cookies-next';
import React from 'react';

interface Props {
  query: string;
  handleQuery: (query: string) => void;
  community: Community | '';
  handleCommunity: (community: Community) => void;
  refetch: () => void;
  posts: Post[];
}

const PostSection: React.FC<Props> = ({ query, handleQuery, community, handleCommunity, refetch, posts }) => {
  const handleDelete = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie('access_token')}` },
    });

    if (response.ok) refetch();
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-8">
      <div className="flex justify-between gap-5">
        <input
          type="text"
          className="peer rounded-2 w-full border border-green-100 px-3.5 py-2.5"
          placeholder="Search"
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
        />
        <div className="flex shrink-0 gap-2.5 peer-focus:hidden">
          <select
            className="font-ibm rounded-2 items-center px-3.5 py-2.5 text-sm font-semibold"
            value={community}
            onChange={(e) => handleCommunity(e.target.value as Community)}
          >
            <option value="">Community</option>
            <option value={Community.HISTORY}>History</option>
            <option value={Community.FOOD}>Food</option>
            <option value={Community.OTHER}>Other</option>
          </select>
          <CreateButton onCreate={refetch} />
        </div>
      </div>
      <div className="rounded-3 divide-y divide-gray-100 border border-gray-100 bg-white">
        {posts &&
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onUpdate={refetch}
              query={query.length >= 2 ? query : ''}
            />
          ))}
      </div>
    </div>
  );
};

export default PostSection;
