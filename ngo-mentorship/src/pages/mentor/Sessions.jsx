import { sessions, students, mentors } from '../../data/mockData';
import { Plus, Check, X, MapPin, Video } from 'lucide-react';
import { useState } from 'react';

export default function Sessions() {
  const [tab, setTab] = useState('upcoming');
  const mentor = mentors[0];
  const mySessions = sessions.filter(s => s.mentorId === mentor.id);
  const upcoming = mySessions.filter(s => s.status === 'scheduled');
  const completed = mySessions.filter(s => s.status === 'completed');

  const list = tab === 'upcoming' ? upcoming : completed;

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Sessions</h1>
          <p className="page-subtitle">{upcoming.length} upcoming · {completed.length} completed</p>
        </div>
        <button className="btn btn-primary"><Plus size={16} /> Schedule Session</button>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</button>
        <button className={`tab ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>Completed ({completed.length})</button>
      </div>

      <div className="grid-2">
        {list.map(sess => {
          const student = students.find(s => s.id === sess.studentId);
          const date = new Date(sess.scheduledDate);
          return (
            <div key={sess.id} className="session-card">
              <div className="session-card-header">
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                <span className={`session-type ${sess.type}`}>{sess.type === 'online' ? <><Video size={12} /> Online</> : <><MapPin size={12} /> Offline</>}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
                  {student?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{student?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sess.topic}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                🕐 {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                {sess.offlineLocation && <span> · 📍 {sess.offlineLocation}</span>}
              </div>
              {sess.status === 'scheduled' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm"><Check size={14} /> Complete</button>
                  <button className="btn btn-danger btn-sm"><X size={14} /> Cancel</button>
                </div>
              )}
              {sess.status === 'completed' && sess.notes && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 12px', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--radius-md)' }}>
                  📝 {sess.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
