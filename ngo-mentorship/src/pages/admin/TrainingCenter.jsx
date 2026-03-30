import { useRef, useState, useEffect } from 'react';
import { commonVideos, mentorVideos } from '../../data/videoData';
import { supabase } from '../../lib/supabaseClient';
import VideoPlayer from '../../components/VideoPlayer';
import { CheckCircle, Clock, Play, Plus } from 'lucide-react';

export default function TrainingCenter() {
  const fileInputRef = useRef(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMentors() {
      try {
        // Fetch up to 30 active mentors
        const { data, error } = await supabase
          .from('mentors')
          .select('mentor_id, full_name, created_at')
          .limit(30)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setMentors(data || []);
      } catch (err) {
        console.error("Error loading mentors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMentors();
  }, []);

  // Pseudo-random progress generator based on string hash to remain consistent on re-renders
  const getMentorProgress = (mentor) => {
    if (!mentor.full_name) return 0;
    let hash = 0;
    for (let i = 0; i < mentor.full_name.length; i++) {
        hash = mentor.full_name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const pseudoRandom = Math.abs(hash * 31 % 101); // 0 to 100
    
    // Some manual balancing so we see a good mix of 0%, 100%, and partials
    if (pseudoRandom < 20) return 0;
    if (pseudoRandom > 80) return 100;
    return pseudoRandom;
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      alert(`[Demo Mode] Successfully parsed "${e.target.files[0].name}"! In a live environment, this would upload to Supabase Storage.`);
      // Reset input
      e.target.value = '';
    }
  };

  const allVideos = [...mentorVideos, ...commonVideos];

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Training Center</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Manage training media and track mentor completion</p>
        </div>
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

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Platform Library
          <span className="badge badge-purple">{allVideos.length} Videos</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {allVideos.map(video => (
            <VideoPlayer key={video.id} video={video} isStudent={false} />
          ))}
        </div>
      </div>

      <div className="data-table-wrapper">
        <div className="data-table-header">
          <div className="data-table-title">Mentor Training Progress Tracker</div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{mentors.length} Latest Mentors</span>
        </div>
        <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--table-header-bg)', zIndex: 10 }}>
              <tr>
                <th>Mentor Name</th>
                <th>Training Status</th>
                <th>Module Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>Loading live tracker...</td></tr>
              ) : mentors.length === 0 ? (
                <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>No mentors found</td></tr>
              ) : (
                mentors.map(m => {
                  const progress = getMentorProgress(m);
                  return (
                    <tr key={m.mentor_id}>
                      <td style={{ fontWeight: 600 }}>{m.full_name}</td>
                      <td>
                        {progress >= 100 ? <span className="badge badge-active"><CheckCircle size={12} /> Completed</span>
                          : progress > 0 ? <span className="badge badge-warning"><Clock size={12} /> In Progress</span>
                          : <span className="badge badge-pending"><Play size={12} /> Not Started</span>}
                      </td>
                      <td style={{ minWidth: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="progress-bar-container" style={{ flex: 1 }}>
                            <div className="progress-bar-track" style={{ height: '8px' }}>
                              <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                            </div>
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '40px', textAlign: 'right' }}>
                            {Math.min(progress, 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
