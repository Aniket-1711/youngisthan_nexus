import { useRef } from 'react';
import { commonVideos, mentorVideos } from '../../data/videoData';
import VideoPlayer from '../../components/VideoPlayer';
import { Plus } from 'lucide-react';

export default function MentorTraining() {
  const fileInputRef = useRef(null);
  
  const allVideos = [...mentorVideos, ...commonVideos];

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      alert(`[Demo Mode] Successfully added "${e.target.files[0].name}"! In a live environment, this would upload to the central repository and grant student access.`);
      e.target.value = '';
    }
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Training & Library</h1>
          <p className="page-subtitle" style={{ margin: 0, marginTop: '4px' }}>Review your own training modules or upload resources for students</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <input 
            type="file" 
            accept="video/mp4" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
            <Plus size={16} /> Add Course
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Your Available Video Modules
          <span className="badge badge-purple">{allVideos.length} Videos</span>
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {allVideos.map(video => (
            <VideoPlayer key={video.id} video={video} isStudent={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
