import { Comment } from '@/interfaces';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  comment: Comment;
}

const CommentItem: React.FC<Props> = ({ comment }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <img src="/avatar.png" alt="avatar" className="h-12 w-12" />
        <div className="gap flex items-baseline gap-2.5">
          <p className="text-sm font-medium">{comment.user.username}</p>
          <p className="text-xs text-gray-300">{dayjs(comment.createdAt).fromNow()}</p>
        </div>
      </div>
      <p className="ml-2.5 pl-12">{comment.content}</p>
    </div>
  );
};

export default CommentItem;
