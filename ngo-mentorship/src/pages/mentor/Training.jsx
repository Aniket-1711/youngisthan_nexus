import { trainingContent, mentorTrainingProgress } from '../../data/mockData';
import { Video, FileText, File, CheckCircle, Clock, Play, Lock } from 'lucide-react';

export default function MentorTraining() {
  const mentorId = 'm1';
  const myProgress = mentorTrainingProgress.filter(p => p.mentorId === mentorId);
  const completed = myProgress.filter(p => p.status === 'completed').length;
  const total = trainingContent.length;
  const pct = Math.round((completed / total) * 100);
  const typeIcons = { video: Video, pdf: FileText, document: File };

  return (
    <div className="animate-in">
      <h1 className="page-title">Training Module</h1>
      <p className="page-subtitle">Complete all training to become an active mentor</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Your Progress</h3>
          <span style={{ fontWeight: 700, color: pct === 100 ? 'var(--success)' : 'var(--accent)' }}>{pct}% Complete</span>
        </div>
        <div className="progress-bar-track" style={{ height: '12px' }}>
          <div className="progress-bar-fill" style={{ width: `${pct}%`, height: '12px' }} />
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>{completed}/{total} modules completed</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {trainingContent.map(tc => {
          const prog = myProgress.find(p => p.contentId === tc.id);
          const Icon = typeIcons[tc.type] || File;
          const isCompleted = prog?.status === 'completed';
          const isInProgress = prog?.status === 'in_progress';

          return (
            <div key={tc.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', opacity: isCompleted ? 0.7 : 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: isCompleted ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCompleted ? 'var(--success)' : 'var(--info)', flexShrink: 0 }}>
                {isCompleted ? <CheckCircle size={22} /> : <Icon size={22} />}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '2px' }}>{tc.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tc.description}</p>
                {prog?.timeSpent && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>⏱ {prog.timeSpent} mins spent</p>}
              </div>
              <div>
                {isCompleted && <span className="badge badge-active"><CheckCircle size={12} /> Done</span>}
                {isInProgress && <span className="badge badge-warning"><Clock size={12} /> In Progress</span>}
                {!prog && <button className="btn btn-primary btn-sm"><Play size={14} /> Start</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
