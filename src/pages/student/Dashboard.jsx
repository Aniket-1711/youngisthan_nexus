import { Star, Phone, MessageSquare, Calendar, Video, FileText, BookOpen } from 'lucide-react';
import { mentors, students, sessions, progressRecords, trainingContent } from '../../data/mockData';

export default function StudentDashboard() {
  const student = students[0]; // Ravi Kumar
  const mentor = mentors.find(m => m.id === student.assignedMentorId);
  const mySessions = sessions.filter(s => s.studentId === student.id);
  const upcoming = mySessions.filter(s => s.status === 'scheduled');
  const records = progressRecords.filter(p => p.studentId === student.id).sort((a, b) => b.weekNumber - a.weekNumber);
  const latest = records[0];

  return (
    <div className="animate-in">
      <h1 className="page-title">Hello, {student.name}! 👋</h1>
      <p className="page-subtitle">Here's your learning dashboard</p>

      {/* Mentor Card */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(6,182,212,0.04))' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>
            {mentor?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>👨‍🏫 {mentor?.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{mentor?.skills.join(', ')} Expert</p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <Star size={14} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} /> {mentor?.performanceRating}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Phone size={14} /> {mentor?.phone.slice(0, 5)}XXXXX
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary"><MessageSquare size={16} /> Chat Now</button>
            <button className="btn btn-secondary"><Calendar size={16} /> Schedule</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Progress */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>My Progress</h3>
          {latest ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="progress-bar-container">
                <div className="progress-bar-label"><span>{student.needs[0]}</span><span>{latest.metrics.quizAverage}%</span></div>
                <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${latest.metrics.quizAverage}%` }} /></div>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-label"><span>Attendance</span><span>{latest.metrics.attendanceRate}%</span></div>
                <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${latest.metrics.attendanceRate}%` }} /></div>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-label"><span>Assignments</span><span>{latest.metrics.assignmentCompletion}%</span></div>
                <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${latest.metrics.assignmentCompletion}%` }} /></div>
              </div>
            </div>
          ) : <p style={{ color: 'var(--text-muted)' }}>No progress data yet</p>}
        </div>

        {/* Upcoming Sessions */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Upcoming Sessions</h3>
          {upcoming.length > 0 ? upcoming.map(sess => {
            const date = new Date(sess.scheduledDate);
            return (
              <div key={sess.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: sess.type === 'online' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sess.type === 'online' ? 'var(--info)' : 'var(--warning)' }}>
                  {sess.type === 'online' ? <Video size={18} /> : <Calendar size={18} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sess.topic}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} · {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`session-type ${sess.type}`} style={{ marginLeft: 'auto' }}>{sess.type}</span>
              </div>
            );
          }) : <p style={{ color: 'var(--text-muted)' }}>No upcoming sessions</p>}
        </div>
      </div>

      {/* Learning Resources */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>📚 Learning Resources</h3>
        <div className="grid-3">
          {trainingContent.slice(0, 3).map(tc => (
            <div key={tc.id} style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', transition: 'var(--transition)' }}>
              {tc.type === 'video' ? <Video size={20} style={{ color: 'var(--danger)' }} /> : <FileText size={20} style={{ color: 'var(--info)' }} />}
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{tc.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tc.type.toUpperCase()} · {tc.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
