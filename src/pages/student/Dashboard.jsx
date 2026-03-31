import { useState } from 'react';
import { Star, Phone, MessageSquare, Calendar, Video, FileText, BookOpen, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mentors, students, sessions, progressRecords, trainingContent } from '../../data/mockData';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const student = students[0]; // Ravi Kumar
  const mentor = mentors.find(m => m.id === student.assignedMentorId);
  const mySessions = sessions.filter(s => s.studentId === student.id);
  const upcoming = mySessions.filter(s => s.status === 'scheduled');
  const records = progressRecords.filter(p => p.studentId === student.id).sort((a, b) => b.weekNumber - a.weekNumber);
  const latest = records[0];

  // Schedule modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    subject: ''
  });
  const [scheduledByStudent, setScheduledByStudent] = useState([]);

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.subject) {
      alert('Please fill all fields');
      return;
    }

    setScheduledByStudent(prev => [...prev, {
      id: `stud_sched_${Date.now()}`,
      date: scheduleForm.date,
      time: scheduleForm.time,
      subject: scheduleForm.subject,
      mentorName: mentor?.name
    }]);

    setIsModalOpen(false);
    setScheduleForm({ date: '', time: '', subject: '' });
  };

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
                <Phone size={14} /> {mentor?.phone}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={() => navigate('/student/chat')}><MessageSquare size={16} /> Chat Now</button>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(true)}><Calendar size={16} /> Schedule</button>
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

      {/* SCHEDULE SESSION MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '100%', padding: '0', animation: 'scaleUp 0.3s ease-out' }}>
            <div style={{ padding: '20px', borderBottom: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accent)', color: '#fff' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Schedule a Session</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ padding: '20px' }}>
              {/* Mentor display */}
              <div className="form-group">
                <label>Mentor</label>
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--table-header-bg)',
                  border: 'var(--border-width) solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)'
                }}>
                  {mentor?.name}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  value={scheduleForm.subject}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                  required
                >
                  <option value="">-- Select Subject --</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Goal Setting">Goal Setting</option>
                  <option value="Life Skills">Life Skills</option>
                  <option value="Career Guidance">Career Guidance</option>
                </select>
              </div>

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
