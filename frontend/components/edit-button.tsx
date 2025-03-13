'use client';

import { useAuth } from '@/contexts/auth-context';
import { Community } from '@/enums';
import { Post } from '@/interfaces';
import { getCookie } from 'cookies-next';
import { EditIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  post: Post;
  onUpdate: () => void;
}

interface FormValues {
  title: string;
  content: string;
  community: Community;
}

const EditButton: React.FC<Props> = ({ post, onUpdate }) => {
  const { isLoggedIn } = useAuth();

  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(!isOpen);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: post.title,
      content: post.content,
      community: post.community as Community,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${post.id}`, {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('access_token')}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      reset();
      handleOpen();
      onUpdate();
    }
  };

  return (
    <React.Fragment>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            className="rounded-3 relative flex w-full max-w-2xl flex-col gap-7 bg-white px-4 py-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <XIcon className="absolute top-4 right-4 h-6 w-6 cursor-pointer" onClick={handleOpen} />
            <p className="text-2xl font-semibold">Edit Post</p>
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
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="rounded-2 bg-success font-ibm px-6 py-2.5 text-sm font-semibold text-white"
            >
              Edit
            </button>
          </form>
        </div>
      )}
      <button onClick={handleOpen} disabled={!isLoggedIn}>
        <EditIcon size={20} />
      </button>
    </React.Fragment>
  );
};

export default EditButton;
