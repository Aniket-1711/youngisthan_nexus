'use client';

import { useEffect, useState } from 'react';
import { getNGOStats } from '@/lib/db';
import { getMentorRatioColor, getMentorRatioBg } from '@/lib/utils';
import {
  Users, GraduationCap, MapPin, Activity,
  Wifi, WifiOff, TrendingUp, RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Stats {
  totalMentors: number;
  activeMentors: number;
  totalStudents: number;
  assignedStudents: number;
  ratio: number;
  schools: number;
  cities: number;
  sessionsThisWeek: number;
  onlineSessions: number;
  offlineSessions: number;
  mentorPerformance: { id: string; name: string; studentCount: number; avgProgress: number }[];
}

export default function NGOAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getNGOStats();
      setStats(data as Stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Live platform overview</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={GraduationCap} label="Total Mentors" value={stats?.totalMentors ?? 0}
          sub={`${stats?.activeMentors ?? 0} active`} color="indigo" />
        <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0}
          sub={`${stats?.assignedStudents ?? 0} assigned`} color="blue" />
        <StatCard icon={MapPin} label="Schools & Cities" value={stats?.schools ?? 0}
          sub={`${stats?.cities ?? 0} cities`} color="green" />
        <StatCard icon={Activity} label="Sessions This Week" value={stats?.sessionsThisWeek ?? 0}
          sub={`${stats?.onlineSessions ?? 0} online / ${stats?.offlineSessions ?? 0} offline`} color="purple" />
      </div>

      {/* Mentor:Student ratio */}
      <div className={`rounded-2xl border-2 p-6 mb-8 ${getMentorRatioBg(stats?.ratio ?? 0)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Mentor : Student Ratio</p>
            <p className={`text-4xl font-bold mt-1 ${getMentorRatioColor(stats?.ratio ?? 0)}`}>
              1 : {(stats?.ratio ?? 0).toFixed(1)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Target: ≤ 1:5</p>
            <p className={`text-sm font-semibold mt-1 ${getMentorRatioColor(stats?.ratio ?? 0)}`}>
              {(stats?.ratio ?? 0) <= 5 ? '✓ Good' : (stats?.ratio ?? 0) <= 10 ? '⚠ Moderate' : '✗ Critical'}
            </p>
          </div>
        </div>
      </div>

      {/* Sessions chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" /> Sessions Breakdown
          </h3>
          <div className="flex gap-4">
            <div className="flex-1 bg-blue-50 rounded-xl p-4 text-center">
              <Wifi className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{stats?.onlineSessions ?? 0}</p>
              <p className="text-xs text-blue-600">Online</p>
            </div>
            <div className="flex-1 bg-amber-50 rounded-xl p-4 text-center">
              <WifiOff className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-700">{stats?.offlineSessions ?? 0}</p>
              <p className="text-xs text-amber-600">Offline</p>
            </div>
          </div>
        </div>

        {/* Mentor performance heatmap */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> Mentor Load
          </h3>
          {stats?.mentorPerformance && stats.mentorPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.mentorPerformance.slice(0, 8)}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                <Tooltip />
                <Bar dataKey="studentCount" radius={[4, 4, 0, 0]}>
                  {stats.mentorPerformance.slice(0, 8).map((m, i) => (
                    <Cell key={i} fill={m.studentCount > 5 ? '#ef4444' : m.studentCount >= 3 ? '#f59e0b' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No mentors yet. Add mentors to see their load here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: number; sub: string; color: string;
}) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
