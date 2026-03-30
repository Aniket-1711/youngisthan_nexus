'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Users, Download, BookOpen, LogOut } from 'lucide-react';
import { OfflineBanner } from '@/components/ui/offline-banner';

const navItems = [
  { href: '/mentor/mentees', label: 'My Mentees', icon: Users },
  { href: '/mentor/offline', label: 'Offline Pack', icon: Download },
];

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading, logout, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || role !== 'mentor')) router.replace('/login');
  }, [user, role, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">MentorBridge</p>
              <p className="text-xs text-blue-600 font-medium">Mentor</p>
            </div>
          </div>
          {profile && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
              <p className="text-xs text-gray-500">{profile.email}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith(href) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition">
            <LogOut className="w-4 h-4" />Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
      <OfflineBanner />
    </div>
  );
}
