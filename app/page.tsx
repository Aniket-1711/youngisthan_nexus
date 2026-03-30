'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (role === 'ngo') router.replace('/ngo/analytics');
    else if (role === 'mentor') router.replace('/mentor/mentees');
    else if (role === 'student') router.replace('/student/tasks');
  }, [user, role, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-indigo-600 font-medium">Loading MentorBridge…</p>
      </div>
    </div>
  );
}
