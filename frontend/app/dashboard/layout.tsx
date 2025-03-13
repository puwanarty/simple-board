'use client';

import Sidebar from '@/components/sidebar';
import { useAuth } from '@/contexts/auth-context';
import { AlignJustifyIcon, ArrowRight } from 'lucide-react';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between bg-green-500 px-8 py-4">
        <p className="font-castoro text-2xl text-white italic">a Board</p>
        {isLoggedIn ? (
          <div className="flex items-center gap-5">
            <p className="font-medium text-white">{user?.username}</p>
            <img src="/avatar.png" alt="user" className="h-10 w-10 rounded-full" />
            <button onClick={toggleSidebar} className="sm:hidden">
              <AlignJustifyIcon size={24} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            className="rounded-2 bg-success font-ibm px-7 py-2.5 text-sm font-semibold text-white"
            onClick={() => redirect('/sign-in', RedirectType.push)}
          >
            Sign In
          </button>
        )}
      </nav>
      <div className="relative flex">
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex h-screen justify-end bg-black/50">
            <div className="flex w-70 flex-col gap-8 bg-green-500 py-9">
              <button onClick={toggleSidebar} className="px-7">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Sidebar />
            </div>
          </div>
        )}
        <div className="w-70 max-sm:hidden">
          <Sidebar />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
