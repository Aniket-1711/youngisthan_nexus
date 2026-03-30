import { trainingContent, mentorTrainingProgress, mentors } from '../../data/mockData';
import { Video, FileText, File, CheckCircle, Clock, Play } from 'lucide-react';

const typeIcons = { video: Video, pdf: FileText, document: File };

export default function TrainingCenter() {
  const getMentorProgress = (mentorId) => {
    const completed = mentorTrainingProgress.filter(p => p.mentorId === mentorId && p.status === 'completed').length;
    return Math.round((completed / trainingContent.length) * 100);
  };

  return (
    <div className="animate-in">
      <h1 className="page-title">Training Center</h1>
      <p className="page-subtitle">Manage training content and track mentor completion</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {trainingContent.map(tc => {
          const Icon = typeIcons[tc.type] || File;
          return (
            <div key={tc.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: tc.type === 'video' ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tc.type === 'video' ? 'var(--danger)' : 'var(--info)', flexShrink: 0 }}>
                <Icon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>{tc.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{tc.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-info">{tc.category}</span>
                  <span className="badge badge-purple">{tc.type.toUpperCase()}</span>
                  {tc.targetAgeGroups.map(g => <span key={g} className="badge badge-pending">Ages {g}</span>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="data-table-wrapper">
        <div className="data-table-header">
          <div className="data-table-title">Mentor Training Progress</div>
        </div>
        <table className="data-table">
          <thead><tr><th>Mentor</th><th>Status</th><th>Completion</th><th>Modules Done</th></tr></thead>
          <tbody>
            {mentors.map(m => {
              const progress = getMentorProgress(m.id);
              const done = mentorTrainingProgress.filter(p => p.mentorId === m.id && p.status === 'completed').length;
              return (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td>
                    {progress === 100 ? <span className="badge badge-active"><CheckCircle size={12} /> Completed</span>
                      : progress > 0 ? <span className="badge badge-warning"><Clock size={12} /> In Progress</span>
                      : <span className="badge badge-pending"><Play size={12} /> Not Started</span>}
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                    </div>
                  </td>
                  <td>{done}/{trainingContent.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
