import { ChevronDown, MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Page: React.FC = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-8">
      <div className="flex justify-between gap-5">
        <input
          type="text"
          className="peer rounded-2 w-full border border-green-100 px-3.5 py-2.5"
          placeholder="Search"
        />
        <div className="flex shrink-0 gap-2.5 peer-focus:hidden">
          <select className="font-ibm rounded-2 items-center px-3.5 py-2.5 text-sm font-semibold">
            <option value="community">Community</option>
            <option value="community">Community</option>
            <option value="community">Community</option>
            <option value="community">Community</option>
          </select>
          <button className="rounded-2 bg-success font-ibm px-6 py-2.5 text-sm font-semibold text-white">
            Create +
          </button>
        </div>
      </div>
      <div className="rounded-3 border border-gray-100 bg-white p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/avatar.png" alt="avatar" className="h-8 w-8" />
            <p className="font-medium text-gray-300">Jessica</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="rounded-3 bg-surface font-ibm flex w-fit px-2 py-1">History</div>
            <div>
              <Link href="/dashboard/1" className="line-clamp-1 font-semibold">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi facere, in reprehenderit quis laboriosam
                rerum ut, itaque voluptates, eaque laudantium quibusdam perferendis dolor deleniti tenetur voluptas
                error eum aut delectus?
              </Link>
              <p className="line-clamp-2 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, delectus veniam odio magnam consequatur
                deleniti vitae blanditiis iusto at in eveniet iure harum quos. Perspiciatis, eveniet quae! Et, inventore
                iste!
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-gray-300">
              <MessageCircleIcon size={16} />
              <span>30 Comments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
