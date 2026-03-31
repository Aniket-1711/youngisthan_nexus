import { progressRecords, students } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentProgress() {
  const student = students[0];
  const records = progressRecords.filter(p => p.studentId === student.id).sort((a, b) => a.weekNumber - b.weekNumber);
  const chartData = records.map(r => ({ week: `Week ${r.weekNumber}`, quiz: r.metrics.quizAverage, attendance: r.metrics.attendanceRate, assignments: r.metrics.assignmentCompletion }));
  const latest = records[records.length - 1];

  return (
    <div className="animate-in">
      <h1 className="page-title">My Progress</h1>
      <p className="page-subtitle">Track your learning journey over time</p>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="stats-card">
          <div className="stats-icon" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)' }}><span style={{ fontSize: '1.2rem' }}>📊</span></div>
          <div className="stats-info">
            <div className="stats-label">Quiz Average</div>
            <div className="stats-value" style={{ fontSize: '1.4rem' }}>{latest?.metrics.quizAverage || 0}%</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--info)' }}><span style={{ fontSize: '1.2rem' }}>📅</span></div>
          <div className="stats-info">
            <div className="stats-label">Attendance</div>
            <div className="stats-value" style={{ fontSize: '1.4rem' }}>{latest?.metrics.attendanceRate || 0}%</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon" style={{ background: 'rgba(168,85,247,0.12)', color: 'var(--purple)' }}><span style={{ fontSize: '1.2rem' }}>📝</span></div>
          <div className="stats-info">
            <div className="stats-label">Assignments</div>
            <div className="stats-value" style={{ fontSize: '1.4rem' }}>{latest?.metrics.assignmentCompletion || 0}%</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.82rem' }} />
            <Bar dataKey="quiz" fill="#14b8a6" radius={[4,4,0,0]} name="Quiz" />
            <Bar dataKey="attendance" fill="#3b82f6" radius={[4,4,0,0]} name="Attendance" />
            <Bar dataKey="assignments" fill="#a855f7" radius={[4,4,0,0]} name="Assignments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
