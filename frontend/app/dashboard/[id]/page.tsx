'use client';

import { ArrowLeftCircleIcon, ArrowLeftIcon, MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface Props {}

const Page: React.FC<Props> = (props) => {
  const { id } = useParams();
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);

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
                <p className="text-sm font-medium">Jessica</p>
                <p className="text-xs text-gray-300">5mo. ago</p>
              </div>
            </div>
            <div className="rounded-3 bg-surface font-ibm flex w-fit px-2 py-1">History</div>
          </div>
          <p className="text-3xl font-semibold">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint sunt deserunt ipsum nesciunt quam nihil rem!
            Nihil neque animi, in sunt quod ea accusantium blanditiis quia doloribus soluta! Quia, aspernatur.
          </p>
          <p className="text-xs">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint sunt deserunt ipsum nesciunt quam nihil rem!
            Nihil neque animi, in sunt quod ea accusantium blanditiis quia doloribus soluta! Quia, aspernatur.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-gray-300">
          <MessageCircleIcon size={16} />
          <span>30 Comments</span>
        </div>
        {isCommentsOpen ? (
          <div>
            <textarea
              className="rounded-2 w-full border border-gray-100 px-3.5 py-2.5"
              placeholder="What's on your mind..."
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
          </div>
        ) : (
          <button
            className="rounded-2 text-success border-success font-ibm w-fit border px-4 py-2.5 font-semibold"
            onClick={() => setIsCommentsOpen(true)}
          >
            Add Comments
          </button>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <img src="/avatar.png" alt="avatar" className="h-12 w-12" />
            <div className="gap flex items-baseline gap-2.5">
              <p className="text-sm font-medium">Jessica</p>
              <p className="text-xs text-gray-300">5mo. ago</p>
            </div>
          </div>
          <p className="ml-2.5 pl-12">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam deserunt provident ab corporis iste pariatur
            atque mollitia? Officiis modi pariatur maxime dignissimos dolorem voluptatibus cum sint quod cumque eaque!
            Pariatur?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
