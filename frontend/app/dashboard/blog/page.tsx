'use client';

import PostSection from '@/components/post-section';
import { Community } from '@/enums';
import usePost from '@/hooks/use-post';
import React from 'react';

const Page: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [community, setCommunity] = React.useState<Community | ''>('');

  const { getMyPosts } = usePost();

  const { data: posts, error, mutate: refresh } = getMyPosts(query, community);

  return (
    <PostSection
      query={query}
      handleQuery={setQuery}
      community={community}
      handleCommunity={setCommunity}
      refresh={refresh}
      posts={posts || []}
    />
  );
};

export default Page;
