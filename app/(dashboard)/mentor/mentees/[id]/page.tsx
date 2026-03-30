'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStudent, getSessionsByStudent, getTasksByStudent, createSession, createTask, verifyTask } from '@/lib/db';
import { useAuth } from '@/lib/auth-context';
import type { Student, Session, Task } from '@/lib/types';
import { ProgressRing } from '@/components/ui/progress-ring';
import { formatDate, SUBJECTS } from '@/lib/utils';
import { Phone, Video, ArrowLeft, Plus, CheckCircle, ClipboardList } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'notes'>('overview');

  // Task form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('Math');
  const [taskXP, setTaskXP] = useState(50);
  const [taskDesc, setTaskDesc] = useState('');

  // Session form
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionProgress, setSessionProgress] = useState(50);
  const [sessionType, setSessionType] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    if (!id) return;
    Promise.all([getStudent(id), getSessionsByStudent(id), getTasksByStudent(id)])
      .then(([s, sess, t]) => {
        setStudent(s); setSessions(sess); setTasks(t); setLoading(false);
      });
  }, [id]);

  const progressChart = sessions.map((s, i) => ({
    session: `S${i + 1}`,
    progress: s.progressScore || 0,
  }));

  const addTask = async () => {
    if (!taskTitle || !user || !id) return;
    await createTask({
      studentId: id, mentorId: user.uid,
      title: taskTitle, description: taskDesc,
      subject: taskSubject, status: 'todo',
      xpReward: taskXP, verifiedByMentor: false,
      dueDate: null,
    });
    const updated = await getTasksByStudent(id);
    setTasks(updated);
    setTaskTitle(''); setTaskDesc(''); setShowTaskForm(false);
  };

  const logSession = async () => {
    if (!user || !id) return;
    await createSession({
      mentorId: user.uid, studentId: id,
      date: new Date(), type: sessionType,
      notes: sessionNotes, synced: true,
      progressScore: sessionProgress,
    });
    // Update student progress
    const { updateStudent } = await import('@/lib/db');
    await updateStudent(id, { progressScore: sessionProgress });
    const [s, sess] = await Promise.all([getStudent(id), getSessionsByStudent(id)]);
    setStudent(s); setSessions(sess);
    setSessionNotes(''); setShowSessionForm(false);
  };

  const verify = async (task: Task) => {
    await verifyTask(task.id, id!, task.xpReward);
    const [s, t] = await Promise.all([getStudent(id!), getTasksByStudent(id!)]);
    setStudent(s); setTasks(t);
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!student) return <div className="p-8 text-gray-500">Student not found.</div>;

  return (
    <div className="p-8 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to mentees
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-500 text-sm mt-1">Age {student.age} · {student.school} · {student.gender}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {student.needs?.map(n => <span key={n} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{n}</span>)}
            </div>
          </div>
          <ProgressRing value={student.progressScore || 0} size={72} strokeWidth={6} color="#3b82f6" />
        </div>

        <div className="flex gap-3 mt-5">
          {student.internetAccess ? (
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
              <Video className="w-4 h-4" /> Start Video Call
            </button>
          ) : (
            <a href={`tel:${student.parentPhone}`} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200">
              <Phone className="w-4 h-4" /> Call Parent: {student.parentPhone}
            </a>
          )}
          <button onClick={() => setShowSessionForm(!showSessionForm)}
            className="flex items-center gap-2 border border-blue-300 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-50">
            <Plus className="w-4 h-4" /> Log Session
          </button>
        </div>

        {showSessionForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Session type</label>
                <select value={sessionType} onChange={e => setSessionType(e.target.value as 'online' | 'offline')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Progress score: {sessionProgress}</label>
                <input type="range" min={0} max={100} value={sessionProgress}
                  onChange={e => setSessionProgress(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)}
              placeholder="Session notes…" rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            <div className="flex gap-2">
              <button onClick={logSession} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
              <button onClick={() => setShowSessionForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {(['overview', 'tasks', 'notes'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {progressChart.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Progress Over Sessions</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={progressChart}>
                  <XAxis dataKey="session" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Internet Access" value={student.internetAccess ? 'Yes' : 'No'} />
            <InfoCard label="Available Time" value={student.availableTime || '—'} />
            <InfoCard label="Location" value={student.urban_rural} />
            <InfoCard label="XP Points" value={`${student.xpPoints || 0} XP`} />
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Assigned Tasks</h3>
            <button onClick={() => setShowTaskForm(!showTaskForm)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Assign Task
            </button>
          </div>

          {showTaskForm && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
              <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
                placeholder="Task title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
              <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)}
                placeholder="Description (optional)" rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={taskSubject} onChange={e => setTaskSubject(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <input type="number" value={taskXP} onChange={e => setTaskXP(Number(e.target.value))}
                  placeholder="XP reward" min={10} max={200}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add Task</button>
                <button onClick={() => setShowTaskForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{task.subject} · {task.xpReward} XP</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.status === 'done' ? 'bg-green-100 text-green-700' :
                    task.status === 'inprogress' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{task.status}</span>
                  {task.status === 'done' && !task.verifiedByMentor && (
                    <button onClick={() => verify(task)}
                      className="flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1 rounded-lg hover:bg-green-700">
                      <CheckCircle className="w-3 h-3" /> Verify
                    </button>
                  )}
                  {task.verifiedByMentor && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No tasks yet. Assign a task above.</p>}
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <div key={s.id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Session {sessions.length - i}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{s.type}</span>
                  <span className="text-xs text-gray-400">{formatDate(s.date)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{s.notes || 'No notes recorded.'}</p>
            </div>
          ))}
          {sessions.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No sessions logged yet.</p>}
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
