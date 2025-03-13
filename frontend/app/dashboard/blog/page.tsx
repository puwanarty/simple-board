'use client';

import PostSection from '@/components/post-section';
import { Community } from '@/enums';
import { Post as IPost } from '@/interfaces';
import { getCookie } from 'cookies-next';
import React from 'react';
import useSWR from 'swr';

const Page: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [community, setCommunity] = React.useState<Community | ''>('');

  const { data: posts, mutate } = useSWR<IPost[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/post/me?q=${query}${community ? `&community=${community}` : ''}`,
    async (url: string) =>
      fetch(url, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie('access_token')}` },
      }).then((res) => res.json()),
  );

  return (
    <PostSection
      query={query}
      handleQuery={setQuery}
      community={community}
      handleCommunity={setCommunity}
      refetch={mutate}
      posts={posts || []}
    />
  );
};

export default Page;
