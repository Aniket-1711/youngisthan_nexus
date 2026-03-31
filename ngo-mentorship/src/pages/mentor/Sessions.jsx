import { useState, useEffect } from 'react';
import { Plus, Check, X, MapPin, Video } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import confetti from 'canvas-confetti';

export default function Sessions() {
  const [tab, setTab] = useState('upcoming');
  const [myStudents, setMyStudents] = useState([]);
  const [sessionsData, setSessionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    studentId: '',
    date: '',
    time: '',
    topic: '',
    mode: 'online',
    location: ''
  });

  const mentorName = 'Gaurav Hegde';

  useEffect(() => {
    async function fetchMentees() {
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
        const studentsData = data ? data.map(d => d.student).filter(Boolean) : [];
        setMyStudents(studentsData);
        
        // Generate initial deterministic frontend-only mock state
        const initialSessions = generateInitialSessions(studentsData);
        setSessionsData(initialSessions);
        
      } catch (err) {
        console.error("Error loading mentees for sessions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMentees();
  }, []);

  const generateInitialSessions = (studentsArr) => {
    let list = [];
    studentsArr.forEach((s, idx) => {
      // Future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1 + (idx * 2));
      futureDate.setHours(16 + (idx % 3), 0, 0, 0);
      const isOnline = idx % 2 === 0;

      list.push({
        id: `sess_a_${idx}`,
        studentId: s.student_id,
        studentName: s.full_name,
        type: isOnline ? 'online' : 'offline',
        topic: s.learning_needs || 'General Mentoring',
        scheduledDate: futureDate,
        status: 'upcoming',
        offlineLocation: isOnline ? null : s.residence_type === 'rural' ? 'Community Center' : 'Local Library'
      });

      // Past
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3 - (idx * 2));
      list.push({
        id: `sess_p_${idx}`,
        studentId: s.student_id,
        studentName: s.full_name,
        type: 'online',
        topic: 'Introduction & Assessment',
        scheduledDate: pastDate,
        status: 'completed',
        offlineLocation: null
      });
    });
    return list;
  };

  const handleComplete = (id) => {
    // Fire Confetti!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#eab308']
    });

    // Move to completed
    setSessionsData(prev => 
      prev.map(s => s.id === id ? { ...s, status: 'completed' } : s)
    );
  };

  const handleCancel = (id) => {
    // Instantly remove from UI Frontend state
    setSessionsData(prev => prev.filter(s => s.id !== id));
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!newSession.studentId || !newSession.date || !newSession.time || !newSession.topic) {
      alert("Please fill all required fields");
      return;
    }

    const studentObj = myStudents.find(s => s.student_id === newSession.studentId);
    if (!studentObj) return;

    // Combine date and time
    const [year, month, day] = newSession.date.split('-');
    const [hours, mins] = newSession.time.split(':');
    const scheduledDateTime = new Date(year, month - 1, day, hours, mins);

    const newSess = {
      id: `new_${Date.now()}`,
      studentId: studentObj.student_id,
      studentName: studentObj.full_name,
      type: newSession.mode,
      topic: newSession.topic,
      scheduledDate: scheduledDateTime,
      status: 'upcoming',
      offlineLocation: newSession.mode === 'offline' ? newSession.location : null
    };

    setSessionsData(prev => [newSess, ...prev]);
    setIsModalOpen(false);
    
    // Reset Form
    setNewSession({
      studentId: '', date: '', time: '', topic: '', mode: 'online', location: ''
    });
  };

  const upcoming = sessionsData.filter(s => s.status === 'upcoming').sort((a,b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  const completed = sessionsData.filter(s => s.status === 'completed').sort((a,b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
  
  const list = tab === 'upcoming' ? upcoming : completed;

  return (
    <div className="animate-in" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Sessions</h1>
          <p className="page-subtitle">{loading ? 'Loading...' : `${upcoming.length} upcoming · ${completed.length} completed`}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Schedule Session
        </button>
      </div>

      <div className="tabs" style={{ marginBottom: '24px' }}>
        <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</button>
        <button className={`tab ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>Completed ({completed.length})</button>
      </div>

      <div className="grid-2">
        {loading && <div style={{ color: 'var(--text-muted)', gridColumn: 'span 2' }}>Fetching your schedule...</div>}
        
        {!loading && list.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: 'span 2', padding: '40px' }}>
            No sessions available. Try matching with students first or schedule one.
          </div>
        )}

        {!loading && list.map(sess => {
          const dateStr = new Date(sess.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
          const timeStr = new Date(sess.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

          return (
            <div key={sess.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dateStr}</div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', border: '1.5px solid #000',
                  background: sess.type === 'online' ? '#38bdf8' : '#facc15', // Blue for Online, Yellow for Offline
                  color: '#000', letterSpacing: '0.5px'
                }}>
                  {sess.type === 'online' ? <Video size={12} /> : <MapPin size={12} />} 
                  {sess.type.toUpperCase()}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000', color: '#fff', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                    {(sess.studentName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0 0 2px' }}>{sess.studentName}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sess.topic}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <span style={{color: 'var(--text-muted)'}}>🕒</span> {timeStr}
                  </div>
                  {sess.offlineLocation && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <span style={{color: 'var(--text-muted)'}}>📍</span> {sess.offlineLocation}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              {sess.status === 'upcoming' && (
                <div style={{ padding: '16px 20px', display: 'flex', gap: '12px', background: 'var(--table-header-bg)', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => handleComplete(sess.id)}
                    style={{ background: '#22c55e', color: '#fff', border: '2px solid #000', borderRadius: '6px', padding: '6px 12px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', boxShadow: '2px 2px 0 #000' }}
                  >
                    <Check size={14} /> Complete
                  </button>
                  <button 
                    onClick={() => handleCancel(sess.id)}
                    style={{ background: '#ef4444', color: '#fff', border: '2px solid #000', borderRadius: '6px', padding: '6px 12px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', boxShadow: '2px 2px 0 #000' }}
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SCHEDULE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{display: 'flex', zIndex: 1000}}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '100%', padding: '0', animation: 'scaleUp 0.3s ease-out' }}>
            <div style={{ padding: '20px', borderBottom: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accent)', color: '#fff' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Schedule New Session</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleScheduleSubmit} style={{ padding: '20px' }}>
              <div className="form-group">
                <label>Select Student</label>
                <select value={newSession.studentId} onChange={(e) => setNewSession({...newSession, studentId: e.target.value})} required>
                  <option value="">-- Choose a Mentee --</option>
                  {myStudents.map(ms => (
                    <option key={ms.student_id} value={ms.student_id}>{ms.full_name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={newSession.date} onChange={(e) => setNewSession({...newSession, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" value={newSession.time} onChange={(e) => setNewSession({...newSession, time: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label>Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mathematics, Goal Setting" 
                  value={newSession.topic} 
                  onChange={(e) => setNewSession({...newSession, topic: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Mode</label>
                <select value={newSession.mode} onChange={(e) => setNewSession({...newSession, mode: e.target.value})}>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {newSession.mode === 'offline' && (
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Community Center, Library" 
                    value={newSession.location} 
                    onChange={(e) => setNewSession({...newSession, location: e.target.value})} 
                    required 
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
