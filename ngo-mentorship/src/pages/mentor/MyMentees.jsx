import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MessageSquare, Calendar, MapPin } from 'lucide-react';

export default function MyMentees() {
  const [myStudents, setMyStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const mentorName = 'Gaurav Hegde';

  useEffect(() => {
    async function fetchMentees() {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select(`
            id,
            status,
            student:students ( student_id, full_name, age, learning_needs, residence_type, gender, school_name ),
            mentor:mentors!inner ( mentor_id, full_name )
          `)
          .eq('status', 'active')
          .eq('mentor.full_name', mentorName);
          
        if (error) throw error;
        setMyStudents(data || []);
      } catch (err) {
        console.error("Error loading mentees:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMentees();
  }, []);

  // Pseudo-random data generator bounded tightly for realistic progress metrics
  const getMetrics = (studentName) => {
    if (!studentName) return { attendance: 0, quiz: 0 };
    let hash = 0;
    for (let i = 0; i < studentName.length; i++) {
        hash = studentName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const attendance = 50 + Math.abs(hash * 13 % 46); // 50 to 95
    const quiz = 45 + Math.abs(hash * 7 % 51); // 45 to 95
    
    return { attendance, quiz };
  };

  if (loading) {
     return <div className="animate-in" style={{ padding: '40px', textAlign: 'center' }}>Loading your mentees...</div>;
  }

  return (
    <div className="animate-in">
      <h1 className="page-title">My Mentees</h1>
      <p className="page-subtitle">{myStudents.length} students currently assigned to you</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {myStudents.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            You haven't been assigned any students yet.
          </div>
        )}
        
        {myStudents.map(assignment => {
          const student = assignment.student;
          if (!student) return null;
          
          const metrics = getMetrics(student.full_name);
          const needsArr = student.learning_needs ? student.learning_needs.split(',').map(s => s.trim()) : [];

          return (
            <div key={assignment.id} className="card">
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>
                  {(student.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0 0 6px' }}>
                        {student.full_name} <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Age {student.age || 'N/A'}</span>
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {needsArr.map(n => <span key={n} className="badge badge-info">{n}</span>)}
                        <span className="badge badge-pending">{student.gender || 'Unknown'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm"><Calendar size={13} /> Schedule</button>
                      <button className="btn btn-primary btn-sm"><MessageSquare size={13} /> Chat</button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', background: 'var(--table-header-bg)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Attendance</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar-container" style={{ flex: 1 }}>
                          <div className="progress-bar-track" style={{ height: '6px' }}>
                            <div className="progress-bar-fill" style={{ width: `${metrics.attendance}%`, background: metrics.attendance >= 75 ? 'var(--success)' : 'var(--warning)' }} />
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{metrics.attendance}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Quiz Average</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: metrics.quiz >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                        {metrics.quiz}%
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>School</div>
                      <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <MapPin size={14} style={{ color: 'var(--text-muted)' }} /> 
                        {student.school_name || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Last Session</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>11-04-2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
