import { students, mentors, progressRecords, sessions } from '../../data/mockData';
import { MessageSquare, Calendar, MapPin } from 'lucide-react';

export default function MyMentees() {
  const mentor = mentors[0];
  const myStudents = students.filter(s => s.assignedMentorId === mentor.id);

  return (
    <div className="animate-in">
      <h1 className="page-title">My Mentees</h1>
      <p className="page-subtitle">{myStudents.length} students assigned to you</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {myStudents.map(student => {
          const records = progressRecords.filter(p => p.studentId === student.id).sort((a, b) => b.weekNumber - a.weekNumber);
          const latest = records[0];
          const studentSessions = sessions.filter(s => s.studentId === student.id);
          const lastCompleted = studentSessions.filter(s => s.status === 'completed').sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

          return (
            <div key={student.id} className="card">
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{student.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>Age {student.age}</span></h3>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                        {student.needs.map(n => <span key={n} className="badge badge-info">{n}</span>)}
                        <span className="badge badge-pending">{student.gender}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm"><Calendar size={13} /> Schedule</button>
                      <button className="btn btn-primary btn-sm"><MessageSquare size={13} /> Chat</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Attendance</div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${latest?.metrics.attendanceRate || 0}%` }} /></div>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: '4px' }}>{latest?.metrics.attendanceRate || 0}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Quiz Average</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: (latest?.metrics.quizAverage || 0) >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                        {latest?.metrics.quizAverage || '—'}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>School</div>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {student.location.schoolName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Last Session</div>
                      <div style={{ fontSize: '0.85rem' }}>{lastCompleted ? new Date(lastCompleted.completedAt).toLocaleDateString() : 'None yet'}</div>
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
