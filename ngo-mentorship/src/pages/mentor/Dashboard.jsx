import { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, MessageSquare, Star } from 'lucide-react';
import { sessions } from '../../data/mockData';
import { supabase } from '../../lib/supabaseClient';

export default function MentorDashboard() {
  const [myStudents, setMyStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded to specifically demo "Gaurav Hegde" from the Supabase DB
  const mentorName = 'Gaurav Hegde';

  useEffect(() => {
    async function loadMentees() {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select(`
            id,
            student:students ( student_id, full_name, age, learning_needs, residence_type ),
            mentor:mentors!inner ( mentor_id, full_name )
          `)
          .eq('status', 'active')
          .eq('mentor.full_name', mentorName);
          
        if (error) throw error;
        setMyStudents(data || []);
      } catch (err) {
        console.error("Failed to load mentees", err);
      } finally {
        setLoading(false);
      }
    }
    loadMentees();
  }, []);

  // Use the same hashing algorithm for consistency
  const getMetrics = (studentName) => {
    if (!studentName) return 0;
    let hash = 0;
    for (let i = 0; i < studentName.length; i++) {
        hash = studentName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 45 + Math.abs(hash * 7 % 51); // 45 to 95
  };

  const upcoming = sessions.filter(s => s.status === 'scheduled').sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)).slice(0, 3); // mocked sessions

  // Fake cap for demo max students, in real app fetched from mentors bounds
  const maxStudents = 10; 

  const stats = [
    { label: 'Active Mentees', value: `${myStudents.length}/${maxStudents}`, icon: Users, color: 'var(--accent)', bg: 'rgba(20,184,166,0.12)' },
    { label: 'Sessions This Week', value: upcoming.length, icon: Calendar, color: 'var(--info)', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Offline Pending', value: upcoming.filter(s => s.type === 'offline').length, icon: MapPin, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Messages Unread', value: 5, icon: MessageSquare, color: 'var(--purple)', bg: 'rgba(168,85,247,0.12)' },
  ];

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Welcome, {mentorName}</h1>
          <p className="page-subtitle">Your mentoring dashboard overview</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.12)', padding: '8px 16px', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
          <Star size={16} style={{ fill: 'var(--warning)' }} /> <strong>4.8</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Rating</span>
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
          const date = new Date(sess.scheduledDate);
          return (
            <div key={sess.id} className="session-card">
              <div className="session-card-header">
                <span style={{ fontWeight: 600 }}>{date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className={`session-type ${sess.type}`}>{sess.type}</span>
              </div>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>{/* mock sess */}Demo Student</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{sess.topic}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>🕐 {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              {sess.offlineLocation && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>📍 {sess.offlineLocation}</p>}
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>My Active Mentees</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Loading mentees from Supabase...</div>}
        
        {!loading && myStudents.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
            No students have been assigned to you yet! Check Auto-Assignment tool.
          </div>
        )}

        {!loading && myStudents.map(assignment => {
          const student = assignment.student;
          if (!student) return null;
          const progress = getMetrics(student.full_name);
          const needsArr = student.learning_needs ? student.learning_needs.split(',').map(n => n.trim()) : [];

          return (
            <div key={assignment.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                {(student.full_name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{student.full_name} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.82rem' }}>({student.age || 'N/A'}y)</span></div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{needsArr.join(', ')}</div>
              </div>
              <div style={{ width: '150px' }}>
                <div className="progress-bar-container" style={{ marginBottom: '0' }}>
                  <div className="progress-bar-label"><span>Quiz Average</span><span style={{fontWeight: 700}}>{progress}%</span></div>
                  <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%`, background: progress >= 80 ? 'var(--success)' : 'var(--warning)' }} /></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-primary btn-sm"><MessageSquare size={13} /> Chat</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
