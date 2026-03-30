import { students, mentors, progressRecords } from '../../data/mockData';
import { Search } from 'lucide-react';
import { useState } from 'react';

const statusColors = { excellent: 'badge-active', on_track: 'badge-info', needs_attention: 'badge-warning' };

export default function MonitorProgress() {
  const [search, setSearch] = useState('');

  const assigned = students.filter(s => s.assignedMentorId);
  const filtered = assigned.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in">
      <h1 className="page-title">Monitor Progress</h1>
      <p className="page-subtitle">Track all mentor-student pairs and their progress</p>

      <div className="data-table-wrapper">
        <div className="data-table-header">
          <div className="data-table-title">{assigned.length} Active Pairs</div>
          <div className="search-box" style={{ width: '240px' }}>
            <Search size={16} />
            <input placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="data-table">
          <thead><tr><th>Student</th><th>Age</th><th>Mentor</th><th>Needs</th><th>Attendance</th><th>Quiz Avg</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(s => {
              const mentor = mentors.find(m => m.id === s.assignedMentorId);
              const latest = progressRecords.filter(p => p.studentId === s.id).sort((a, b) => b.weekNumber - a.weekNumber)[0];
              return (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.age}</td>
                  <td>{mentor?.name || '—'}</td>
                  <td>{s.needs.join(', ')}</td>
                  <td>
                    {latest ? (
                      <div className="progress-bar-container" style={{ width: '100px' }}>
                        <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${latest.metrics.attendanceRate}%` }} /></div>
                      </div>
                    ) : '—'}
                  </td>
                  <td style={{ fontWeight: 600, color: latest?.metrics.quizAverage >= 80 ? 'var(--success)' : latest?.metrics.quizAverage >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
                    {latest?.metrics.quizAverage || '—'}%
                  </td>
                  <td>{latest ? <span className={`badge ${statusColors[latest.status]}`}>{latest.status.replace(/_/g, ' ')}</span> : <span className="badge badge-pending">No data</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
