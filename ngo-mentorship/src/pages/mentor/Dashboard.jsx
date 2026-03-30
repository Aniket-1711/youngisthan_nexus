import { Users, Calendar, MapPin, MessageSquare, Star } from 'lucide-react';
import { students, sessions, mentors, progressRecords } from '../../data/mockData';

export default function MentorDashboard() {
  const mentor = mentors[0]; // Arun Sharma
  const myStudents = students.filter(s => s.assignedMentorId === mentor.id);
  const mySessions = sessions.filter(s => s.mentorId === mentor.id);
  const upcoming = mySessions.filter(s => s.status === 'scheduled').sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const stats = [
    { label: 'Active Mentees', value: `${myStudents.length}/${mentor.maxStudents}`, icon: Users, color: 'var(--accent)', bg: 'rgba(20,184,166,0.12)' },
    { label: 'Sessions This Week', value: upcoming.length, icon: Calendar, color: 'var(--info)', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Offline Pending', value: upcoming.filter(s => s.type === 'offline').length, icon: MapPin, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Messages Unread', value: 5, icon: MessageSquare, color: 'var(--purple)', bg: 'rgba(168,85,247,0.12)' },
  ];

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Welcome, {mentor.name}</h1>
          <p className="page-subtitle">Your mentoring dashboard overview</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.12)', padding: '8px 16px', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
          <Star size={16} style={{ fill: 'var(--warning)' }} /> <strong>{mentor.performanceRating}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Rating</span>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {stats.map(s => (
          <div key={s.label} className="stats-card">
            <div className="stats-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
            <div className="stats-info">
              <div className="stats-label">{s.label}</div>
              <div className="stats-value" style={{ fontSize: '1.4rem' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Upcoming Sessions</h3>
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {upcoming.map(sess => {
          const student = students.find(s => s.id === sess.studentId);
          const date = new Date(sess.scheduledDate);
          return (
            <div key={sess.id} className="session-card">
              <div className="session-card-header">
                <span style={{ fontWeight: 600 }}>{date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className={`session-type ${sess.type}`}>{sess.type}</span>
              </div>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>{student?.name}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{sess.topic}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>🕐 {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              {sess.offlineLocation && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>📍 {sess.offlineLocation}</p>}
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>My Mentees</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {myStudents.map(student => {
          const latest = progressRecords.filter(p => p.studentId === student.id).sort((a, b) => b.weekNumber - a.weekNumber)[0];
          const progress = latest?.metrics.quizAverage || 0;
          return (
            <div key={student.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{student.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.82rem' }}>({student.age}y)</span></div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{student.needs.join(', ')}</div>
              </div>
              <div style={{ width: '120px' }}>
                <div className="progress-bar-container">
                  <div className="progress-bar-label"><span>Progress</span><span>{progress}%</span></div>
                  <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-secondary btn-sm">View</button>
                <button className="btn btn-primary btn-sm"><MessageSquare size={13} /> Chat</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
