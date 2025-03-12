'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
  username: string;
}

const Page: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data));
  };

  return (
    <div className="flex h-screen flex-col bg-green-500 sm:flex-row-reverse">
      <div className="max-sm:rounded-b-8 sm:rounded-l-8 z-10 flex shrink-0 flex-col items-center justify-center gap-6 bg-green-300 max-sm:max-h-90.5 max-sm:min-h-1/2 sm:w-1/2 sm:max-w-158">
        <img src="/login.svg" alt="login" className="w-43 sm:w-75" />
        <p className="font-castoro text-2xl text-white italic">a Board</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-10 p-4">
        <p className="text-3xl font-semibold text-white">Sign in</p>
        <form onSubmit={handleSubmit(onSubmit)} className="font-ibm flex w-full max-w-96 flex-col gap-5">
          <input
            type="text"
            placeholder="Username"
            className="rounded-2 border bg-gray-50 px-3.5 py-2.5"
            {...register}
          />
          <button type="submit" className="rounded-2 bg-success px-3.5 py-2.5 text-sm font-semibold text-white">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
