'use client';

import { useAuth } from '@/contexts/auth-context';
import { Post as IPost } from '@/interfaces';
import { MessageCircleIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import EditButton from './edit-button';

interface Props {
  query?: string;
  post: IPost;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

const PostItem: React.FC<Props> = ({ query, post, onUpdate, onDelete }) => {
  const { user } = useAuth();

  const isOwner = user?.sub === post.userId;

  return (
    <div key={post.id} className="relative flex flex-col gap-4 p-5">
      {isOwner && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <EditButton post={post} onUpdate={onUpdate} />
          <button onClick={() => onDelete(post.id)}>
            <TrashIcon size={20} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2.5">
        <img src="/avatar.png" alt="avatar" className="h-8 w-8" />
        <p className="font-medium text-gray-300">{post.user.username}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="rounded-3 bg-surface font-ibm flex w-fit px-2 py-1 text-sm">{post.community}</div>
        <div>
          <div className="line-clamp-1 font-semibold">
            {query ? (
              <span>
                {post.title.split(new RegExp(`(${query})`, 'gi')).map((part, index) =>
                  part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={index} className="bg-yellow-300">
                      {part}
                    </mark>
                  ) : (
                    part
                  ),
                )}
              </span>
            ) : (
              post.title
            )}
          </div>
          <p className="line-clamp-2 text-sm">{post.content}</p>
        </div>
        <Link href={`/dashboard/${post.id}`} className="flex w-fit items-center gap-1.5 text-gray-300">
          <MessageCircleIcon size={16} />
          {post.comments.length > 0 && <span>{post.comments.length} Comments</span>}
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
