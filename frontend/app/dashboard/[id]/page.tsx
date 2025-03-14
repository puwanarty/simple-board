'use client';

import CommentItem from '@/components/comment-item';
import { useAuth } from '@/contexts/auth-context';
import usePost from '@/hooks/use-post';
import { CreateComment } from '@/interfaces';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ArrowLeftIcon, MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

dayjs.extend(relativeTime);

const Page: React.FC = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = useForm<CreateComment>();
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);

  const openComments = () => setIsCommentsOpen(true);
  const closeComments = () => setIsCommentsOpen(false);

  const { getPost, getComments, createComment } = usePost();

  const { data: post, mutate: refreshPost, isLoading: isPostLoading } = getPost(id as string);
  const { data: comments, mutate: refreshComments, isLoading: isCommentLoading } = getComments(id as string);

  const onSubmit = async (data: CreateComment) => {
    const response = await createComment(id as string, data);

    if ('error' in response) {
      setError('content', { message: response.message[0] });
    }

    if ('id' in response) {
      refreshPost();
      refreshComments();
      closeComments();
    }
  };

  useEffect(() => {
    reset();
  }, [isCommentsOpen]);

  if (isPostLoading || isCommentLoading) return <div>Loading...</div>;

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
            <div className="rounded-3 bg-surface font-ibm flex w-fit px-2 py-1">{post.community}</div>
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
            {errors.content && <p className="text-sm text-red-500 italic">{errors.content.message}</p>}
            <div className="flex justify-end gap-3">
              <button
                className="rounded-2 text-success border-success font-ibm w-28 border py-2.5 font-semibold"
                onClick={closeComments}
              >
                Cancel
              </button>
              <button
                disabled={!isValid || isSubmitting}
                className="rounded-2 bg-success font-ibm w-28 py-2.5 font-semibold text-white"
              >
                Post
              </button>
            </div>
          </form>
        ) : (
          <button
            disabled={!isLoggedIn}
            className="rounded-2 text-success border-success font-ibm w-fit border px-4 py-2.5 font-semibold"
            onClick={openComments}
          >
            Add Comments
          </button>
        )}
        {comments && comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
  ``;
};

export default Page;
