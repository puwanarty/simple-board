'use client';

import { useAuth } from '@/contexts/auth-context';
import { Community } from '@/enums';
import usePost from '@/hooks/use-post';
import { CreatePost } from '@/interfaces';
import { XIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  onCreate: () => void;
}

const CreateButton: React.FC<Props> = ({ onCreate }) => {
  const { isLoggedIn } = useAuth();
  const { createPost } = usePost();

  const [isOpen, setIsOpen] = React.useState(false);

  const openPost = () => setIsOpen(true);
  const closePost = () => setIsOpen(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = useForm<CreatePost>();

  const onSubmit = async (data: CreatePost) => {
    const response = await createPost(data);

    if ('error' in response) {
      setError('root', { message: response.message[0] });
    }

    if ('id' in response) {
      onCreate();
      closePost();
    }
  };

  useEffect(() => {
    reset();
  }, [isOpen]);

  return (
    <React.Fragment>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            className="rounded-3 relative flex w-full max-w-2xl flex-col gap-7 bg-white px-4 py-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <XIcon className="absolute top-4 right-4 h-6 w-6 cursor-pointer" onClick={closePost} />
            <p className="text-2xl font-semibold">Create Post</p>
            <div className="flex flex-col gap-2.5">
              <select
                className="rounded-2 border-success text-success border px-3.5 py-2.5 text-sm font-semibold"
                {...register('community')}
              >
                <option value={Community.HISTORY}>History</option>
                <option value={Community.FOOD}>Food</option>
                <option value={Community.OTHER}>Other</option>
              </select>
              <input
                type="text"
                placeholder="Title"
                className="rounded-2 w-full border border-gray-100 px-3.5 py-2.5"
                {...register('title', { required: true })}
              />
              <textarea
                placeholder="What's on your mind?"
                className="rounded-2 min-h-75 w-full border border-gray-100 px-3.5 py-2.5"
                {...register('content', { required: true })}
              />
            </div>
            {errors.root && <p className="text-sm text-red-500 italic">{errors.root.message}</p>}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="rounded-2 bg-success font-ibm px-6 py-2.5 text-sm font-semibold text-white"
            >
              Post
            </button>
          </form>
        </div>
      )}
      <button
        onClick={openPost}
        disabled={!isLoggedIn}
        className="rounded-2 bg-success font-ibm px-6 py-2.5 text-sm font-semibold text-white"
      >
        Create +
      </button>
    </React.Fragment>
  );
};

export default CreateButton;
