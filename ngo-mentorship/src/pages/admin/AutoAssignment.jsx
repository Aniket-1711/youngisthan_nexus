import { useState } from 'react';
import { Zap, CheckCircle, Users, ArrowRight } from 'lucide-react';
import { assignments, othersQueue, mentors, students } from '../../data/mockData';

export default function AutoAssignment() {
  const [tab, setTab] = useState('results');
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setTab('results'); }, 2000);
  };

  return (
    <div className="animate-in">
      <h1 className="page-title">Auto-Assignment Engine</h1>
      <p className="page-subtitle">Match students with mentors based on skills, preferences, and location</p>

      <div className="tabs">
        <button className={`tab ${tab === 'results' ? 'active' : ''}`} onClick={() => setTab('results')}>Assignment Results</button>
        <button className={`tab ${tab === 'queue' ? 'active' : ''}`} onClick={() => setTab('queue')}>Others Queue ({othersQueue.length})</button>
      </div>

      {tab === 'results' && (
        <div>
          <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Run Auto-Assignment</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Matches unassigned students with available trained mentors</p>
            </div>
            <button className="btn btn-primary" onClick={handleRun} disabled={running}>
              {running ? <><span style={{ animation: 'pulse 1s infinite' }}>⚡</span> Running...</> : <><Zap size={16} /> Run Assignment</>}
            </button>
          </div>

          <div className="data-table-wrapper">
            <div className="data-table-header">
              <div className="data-table-title">Recent Assignments</div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{assignments.length} pairs</span>
            </div>
            <table className="data-table">
              <thead><tr><th>Student</th><th></th><th>Mentor</th><th>Match Score</th><th>Type</th><th>Factors</th></tr></thead>
              <tbody>
                {assignments.map(a => {
                  const student = students.find(s => s.id === a.studentId);
                  const mentor = mentors.find(m => m.id === a.mentorId);
                  return (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600 }}>{student?.name}</td>
                      <td><ArrowRight size={16} style={{ color: 'var(--text-muted)' }} /></td>
                      <td style={{ fontWeight: 600 }}>{mentor?.name}</td>
                      <td>
                        <span style={{ color: a.matchScore >= 85 ? 'var(--success)' : a.matchScore >= 70 ? 'var(--warning)' : 'var(--danger)', fontWeight: 700 }}>
                          {a.matchScore}%
                        </span>
                      </td>
                      <td><span className={`badge ${a.assignedBy === 'auto' ? 'badge-info' : 'badge-purple'}`}>{a.assignedBy}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {a.matchFactors.skillMatch && <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Skill ✓</span>}
                          {a.matchFactors.genderPreferenceMet && <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Gender ✓</span>}
                          {a.matchFactors.timingAligned && <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Timing ✓</span>}
                          {a.matchFactors.locationCompatible === true && <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>Location ✓</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'queue' && (
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <div className="data-table-title">Unmatched Students</div>
          </div>
          <table className="data-table">
            <thead><tr><th>Student</th><th>Needs</th><th>Location</th><th>Reason</th><th>Temp Activity</th><th>Action</th></tr></thead>
            <tbody>
              {othersQueue.map(q => (
                <tr key={q.studentId}>
                  <td style={{ fontWeight: 600 }}>{q.student.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({q.student.age}y)</span></td>
                  <td>{q.student.needs.join(', ')}</td>
                  <td>{q.student.location.city}</td>
                  <td><span className="badge badge-warning">{q.reason.replace(/_/g, ' ')}</span></td>
                  <td><span className="badge badge-purple">{q.tempActivityType?.replace(/_/g, ' ')}</span></td>
                  <td><button className="btn btn-primary btn-sm"><Users size={14} /> Assign</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
