'use client';

import React from 'react';
import { EditIcon, HomeIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SIDEBAR_ITEMS = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Our Blog',
    href: '/dashboard/blog',
    icon: EditIcon,
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-1 px-4 text-white sm:py-8 sm:text-green-500">
      {SIDEBAR_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 ${isActive ? 'font-extrabold' : 'font-medium'}`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
