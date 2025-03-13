'use client';

import { Comment as IComment, Post } from '@/interfaces';
import dayjs from 'dayjs';
import { ArrowLeftIcon, MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/auth-context';
import { getCookie } from 'cookies-next';
import Comment from '@/components/comment';

dayjs.extend(relativeTime);

const Page: React.FC = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const { register, handleSubmit, reset } = useForm<{ content: string }>();
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);

  const {
    data: post,
    mutate,
    isLoading,
  } = useSWR<Post>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, (url: string) =>
    fetch(url).then((res) => res.json()),
  );

  const {
    data: comments,
    mutate: commentMutate,
    isLoading: isCommentsLoading,
  } = useSWR<IComment[]>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}/comment`, (url: string) =>
    fetch(url).then((res) => res.json()),
  );

  const onSubmit = async (data: { content: string }) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie('access_token')}` },
      body: JSON.stringify(data),
    });
    mutate();
    commentMutate();
    reset();
    setIsCommentsOpen(false);
  };

  if (isLoading || isCommentsLoading) return <div>Loading...</div>;

  if (!post) return <div>Post not found</div>;

  return (
    <div className="flex-1 bg-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 p-4 sm:p-8">
        <Link href="/dashboard" className="w-fit rounded-full bg-green-100 p-2.5">
          <ArrowLeftIcon className="text-green-500" />
        </Link>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <img src="/avatar.png" alt="avatar" className="h-12 w-12" />
              <div className="gap flex items-baseline gap-2.5">
                <p className="text-sm font-medium">{post.user.username}</p>
                <p className="text-xs text-gray-300">{dayjs(post.createdAt).fromNow()}</p>
              </div>
            </div>
            <div className="rounded-3 bg-surface font-ibm flex w-fit px-2 py-1">History</div>
          </div>
          <p className="text-3xl font-semibold">{post.title}</p>
          <p className="text-xs">{post.content}</p>
        </div>
        <div className="flex items-center gap-1.5 text-gray-300">
          <MessageCircleIcon size={16} />
          {post.comments.length > 0 && <span>{post.comments.length} Comments</span>}
        </div>
        {isCommentsOpen ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              className="rounded-2 w-full border border-gray-100 px-3.5 py-2.5"
              placeholder="What's on your mind..."
              {...register('content')}
            />
            <div className="flex justify-end gap-3">
              <button
                className="rounded-2 text-success border-success font-ibm w-28 border py-2.5 font-semibold"
                onClick={() => setIsCommentsOpen(false)}
              >
                Cancel
              </button>
              <button className="rounded-2 bg-success font-ibm w-28 py-2.5 font-semibold text-white">Post</button>
            </div>
          </form>
        ) : (
          <button
            disabled={!isLoggedIn}
            className="rounded-2 text-success border-success font-ibm w-fit border px-4 py-2.5 font-semibold"
            onClick={() => setIsCommentsOpen(true)}
          >
            Add Comments
          </button>
        )}
        {comments && comments.map((comment) => <Comment key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
  ``;
};

export default Page;
