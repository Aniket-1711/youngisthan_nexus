'use client';

import { useEffect, useState } from 'react';
import { getAllMentors, getAllStudents, updateMentor } from '@/lib/db';
import type { Mentor, Student } from '@/lib/types';
import { getMentorRatioColor, formatDate } from '@/lib/utils';
import { Search, Trash2, RefreshCw, Users, Filter } from 'lucide-react';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function MonitorPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    const [m, s] = await Promise.all([getAllMentors(), getAllStudents()]);
    setMentors(m); setStudents(s); setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const removeMentor = async (mentor: Mentor) => {
    if (!confirm(`Remove ${mentor.name} from the platform? Their students will be re-queued.`)) return;
    await updateMentor(mentor.id, { status: 'Removed', assignedStudents: [] });
    // Unassign students
    for (const sid of mentor.assignedStudents || []) {
      const { updateStudent } = await import('@/lib/db');
      await updateStudent(sid, { assignedMentor: null });
    }
    load();
  };

  const getStudentsForMentor = (mentorId: string) =>
    students.filter(s => s.assignedMentor === mentorId);

  const avgProgress = (mentorId: string) => {
    const ss = getStudentsForMentor(mentorId);
    if (!ss.length) return 0;
    return Math.round(ss.reduce((a, s) => a + (s.progressScore || 0), 0) / ss.length);
  };

  const filtered = mentors
    .filter(m => statusFilter === 'all' || m.status === statusFilter)
    .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitor</h1>
          <p className="text-gray-500 text-sm mt-1">All mentor–student pairs and performance</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search mentor…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="all">All statuses</option>
          <option value="Active">Active</option>
          <option value="On leave">On leave</option>
          <option value="Removed">Removed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Mentor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Students</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Avg Progress</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Duration End</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(mentor => {
                const ss = getStudentsForMentor(mentor.id);
                const avg = avgProgress(mentor.id);
                const ratio = ss.length;
                return (
                  <tr key={mentor.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{mentor.name}</div>
                      <div className="text-xs text-gray-400">{mentor.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${getMentorRatioColor(ratio)}`}>{ratio}</span>
                      <span className="text-gray-400 text-xs ml-1">/ 5 max</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressRing value={avg} size={36} strokeWidth={4} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(mentor.durationEndDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mentor.status === 'Active' ? 'bg-green-100 text-green-700' :
                        mentor.status === 'On leave' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{mentor.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {mentor.status !== 'Removed' && (
                        <button onClick={() => removeMentor(mentor)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No mentors found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
