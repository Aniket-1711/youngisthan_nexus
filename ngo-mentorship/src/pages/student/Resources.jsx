import { trainingContent } from '../../data/mockData';
import { Video, FileText, File, ExternalLink } from 'lucide-react';

export default function StudentResources() {
  const typeIcons = { video: Video, pdf: FileText, document: File };

  return (
    <div className="animate-in">
      <h1 className="page-title">Learning Resources</h1>
      <p className="page-subtitle">Materials shared by your mentor for self-study</p>

      <div className="grid-2">
        {trainingContent.map(tc => {
          const Icon = typeIcons[tc.type] || File;
          return (
            <div key={tc.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: tc.type === 'video' ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tc.type === 'video' ? 'var(--danger)' : 'var(--info)', flexShrink: 0 }}>
                <Icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{tc.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{tc.description}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-info">{tc.category}</span>
                  <span className="badge badge-purple">{tc.type.toUpperCase()}</span>
                </div>
              </div>
              <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
