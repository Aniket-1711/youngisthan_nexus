'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { subscribeStudentsByMentor } from '@/lib/db';
import type { Student } from '@/lib/types';
import { ProgressRing } from '@/components/ui/progress-ring';
import { formatDate, daysUntil } from '@/lib/utils';
import Link from 'next/link';
import { Clock, AlertTriangle, Plus } from 'lucide-react';

export default function MenteesPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeStudentsByMentor(user.uid, s => { setStudents(s); setLoading(false); });
    return unsub;
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Mentees</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} student{students.length !== 1 ? 's' : ''} assigned</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-700">No mentees yet</h3>
          <p className="text-gray-400 text-sm mt-1">The NGO admin will assign students to you soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {students.map(student => (
            <Link key={student.id} href={`/mentor/mentees/${student.id}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Age {student.age} · {student.school}</p>
                  </div>
                  <ProgressRing value={student.progressScore || 0} size={52} strokeWidth={5} color="#3b82f6" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(student.needs || []).slice(0, 3).map(need => (
                    <span key={need} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{need}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {student.availableTime || 'Time not set'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    student.internetAccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {student.internetAccess ? 'Online' : 'Offline only'}
                  </span>
                </div>

                {student.disability && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    <AlertTriangle className="w-3 h-3" /> {student.disability}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
