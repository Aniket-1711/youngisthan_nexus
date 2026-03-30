import { commonVideos } from '../../data/videoData';
import VideoPlayer from '../../components/VideoPlayer';
import { BookOpen } from 'lucide-react';

export default function StudentResources() {
  return (
    <div className="animate-in">
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ padding: '8px', background: 'rgba(59,130,246,0.1)', color: 'var(--info)', borderRadius: 'var(--radius-md)' }}>
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Learning Resources</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Materials shared for self-study. Video progress is tracked automatically.</p>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Recommended Videos
          <span className="badge badge-pending">{commonVideos.length} Modules</span>
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {commonVideos.map(video => (
            <VideoPlayer key={video.id} video={video} isStudent={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
