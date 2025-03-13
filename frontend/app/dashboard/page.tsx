'use client';

import PostSection from '@/components/post-section';
import { Community } from '@/enums';
import { Post as IPost } from '@/interfaces';
import React from 'react';
import useSWR from 'swr';

const Page: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [community, setCommunity] = React.useState<Community | ''>('');

  const { data: posts, mutate } = useSWR<IPost[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/post?q=${query}${community ? `&community=${community}` : ''}`,
    (url: string) => fetch(url).then((res) => res.json()),
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
