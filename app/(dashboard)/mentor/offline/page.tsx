'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getStudentsByMentor } from '@/lib/db';
import { saveOfflineEntry, getUnsynced } from '@/lib/idb';
import type { Student, OfflineEntry } from '@/lib/types';
import { Download, Save, CheckCircle, WifiOff } from 'lucide-react';

export default function OfflinePackPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  // Offline form state per student
  const [forms, setForms] = useState<Record<string, { progress: number; notes: string; tasksCompleted: string[] }>>({});

  useEffect(() => {
    if (!user) return;
    getStudentsByMentor(user.uid).then(s => {
      setStudents(s);
      setLoading(false);
      const initial: typeof forms = {};
      s.forEach(st => { initial[st.id] = { progress: st.progressScore || 0, notes: '', tasksCompleted: [] }; });
      setForms(initial);
    });
    getUnsynced().then(e => setUnsyncedCount(e.length));
  }, [user]);

  const saveEntry = async (student: Student) => {
    if (!user) return;
    const form = forms[student.id];
    const entry: OfflineEntry = {
      id: `${student.id}-${Date.now()}`,
      mentorId: user.uid,
      studentId: student.id,
      sessionDate: new Date().toISOString(),
      progressScore: form.progress,
      notes: form.notes,
      tasksCompleted: form.tasksCompleted,
      synced: false,
    };
    await saveOfflineEntry(entry);
    setSaved(s => ({ ...s, [student.id]: true }));
    setUnsyncedCount(c => c + 1);
    setTimeout(() => setSaved(s => ({ ...s, [student.id]: false })), 2000);
  };

  const updateForm = (studentId: string, field: string, value: unknown) => {
    setForms(f => ({ ...f, [studentId]: { ...f[studentId], [field]: value } }));
  };

  const lessonContent: Record<string, { title: string; content: string }> = {
    '5-10': { title: 'Early Learner Pack', content: 'Activity 1: Count objects around you. Activity 2: Draw and label 5 things you see. Activity 3: Sound out these words: CAT, BAT, MAT, HAT.' },
    '11-14': { title: 'Explorer Pack', content: 'Task 1: Solve 10 multiplication problems. Task 2: Read the passage and answer comprehension questions. Task 3: Draw a diagram of the water cycle.' },
    '15-19': { title: 'Advanced Pack', content: 'Study Goal: Complete Chapter 5 exercises. Practice: Solve 5 algebra equations. Writing: Write a 200-word paragraph about your career goals.' },
  };

  const getAgeGroup = (age: number) => age <= 10 ? '5-10' : age <= 14 ? '11-14' : '15-19';

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offline Pack</h1>
          <p className="text-gray-500 text-sm mt-1">Record session progress offline — syncs when reconnected</p>
        </div>
        {unsyncedCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl text-sm">
            <WifiOff className="w-4 h-4" /> {unsyncedCount} entries pending sync
          </div>
        )}
      </div>

      <div className="space-y-6">
        {students.map(student => {
          const ageGroup = getAgeGroup(student.age);
          const lesson = lessonContent[ageGroup];
          const form = forms[student.id] || { progress: 0, notes: '', tasksCompleted: [] };

          return (
            <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{student.name}</h3>
                    <p className="text-blue-200 text-xs mt-0.5">Age {student.age} · {lesson.title}</p>
                  </div>
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{ageGroup} yrs</span>
                </div>
              </div>

              <div className="p-5">
                {/* Lesson content */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Today&apos;s Activities</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{lesson.content}</p>
                </div>

                {/* Progress slider */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Session Progress: <span className="text-blue-600 font-bold">{form.progress}%</span>
                  </label>
                  <input type="range" min={0} max={100} value={form.progress}
                    onChange={e => updateForm(student.id, 'progress', Number(e.target.value))}
                    className="w-full accent-blue-600" />
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Session Notes</label>
                  <textarea value={form.notes} rows={2}
                    onChange={e => updateForm(student.id, 'notes', e.target.value)}
                    placeholder="How did the session go? Any observations?"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-blue-400" />
                </div>

                <button onClick={() => saveEntry(student)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition ${
                    saved[student.id] ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  {saved[student.id] ? <><CheckCircle className="w-4 h-4" /> Saved to device!</> : <><Save className="w-4 h-4" /> Save Offline</>}
                </button>
              </div>
            </div>
          );
        })}
        {students.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Download className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No students assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
