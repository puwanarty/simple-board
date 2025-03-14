import { useAuth } from '@/contexts/auth-context';
import usePost from '@/hooks/use-post';
import { Comment, UpdateComment } from '@/interfaces';
import dayjs from 'dayjs';
import { EditIcon, TrashIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  comment: Comment;
  refreshComments: () => void;
}

const CommentItem: React.FC<Props> = ({ comment, refreshComments }) => {
  const { user } = useAuth();
  const { updateComment, removeComment } = usePost();
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);

  const openComment = () => setIsCommentOpen(true);
  const closeComment = () => setIsCommentOpen(false);

  const isOwner = user?.sub === comment.userId;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateComment>({
    defaultValues: { ...comment },
  });

  const onSubmit = async (data: UpdateComment) => {
    const response = await updateComment(comment.postId, comment.id, data);

    if ('error' in response) {
      setError('content', { message: response.message[0] });
    }

    if ('id' in response) {
      refreshComments();
      closeComment();
    }
  };

  const onDelete = async () => {
    const response = await removeComment(comment.postId, comment.id);

    if ('id' in response) {
      refreshComments();
    }
  };

  useEffect(() => {
    reset();
  }, [isCommentOpen]);

  return (
    <div className="relative flex flex-col gap-2">
      {isOwner && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <button onClick={openComment}>
            <EditIcon size={20} />
          </button>
          <button onClick={onDelete}>
            <TrashIcon size={20} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2.5">
        <img src="/avatar.png" alt="avatar" className="h-12 w-12" />
        <div className="gap flex items-baseline gap-2.5">
          <p className="text-sm font-medium">{comment.user.username}</p>
          <p className="text-xs text-gray-300">{dayjs(comment.createdAt).fromNow()}</p>
        </div>
      </div>
      {isCommentOpen ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            className="rounded-2 w-full border border-gray-100 px-3.5 py-2.5"
            placeholder="What's on your mind..."
            {...register('content', { required: true })}
          />
          {errors.content && <p className="text-sm text-red-500 italic">{errors.content.message}</p>}
          <div className="flex justify-end gap-3">
            <button
              className="rounded-2 text-success border-success font-ibm w-28 border py-2.5 font-semibold"
              onClick={closeComment}
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
        <p className="ml-2.5 pl-12">{comment.content}</p>
      )}
    </div>
  );
};

export default CommentItem;
