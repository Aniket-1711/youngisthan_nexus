import { useRef, useState, useEffect } from 'react';
import { Play, Maximize, Minimize } from 'lucide-react';
import VideoAIChatbot from './VideoAIChatbot';

export default function VideoPlayer({ video, isStudent }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [maxTime, setMaxTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync state with native fullscreenchange to handle ESC key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    if (currentTime > maxTime) {
      setMaxTime(currentTime);
    }
  };

  const handleSeeking = () => {
    if (!isStudent || !videoRef.current) return;
    if (videoRef.current.currentTime > maxTime + 0.5) {
      videoRef.current.currentTime = maxTime;
    }
  };

  const handleRateChange = () => {
    if (!isStudent || !videoRef.current) return;
    if (videoRef.current.playbackRate > 1.0) {
      videoRef.current.playbackRate = 1.0;
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setHasStarted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to open fullscreen", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="card" style={{ padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
      {/* Container used for unifying video + chatbot inside Fullscreen */}
      <div ref={containerRef} style={{ position: 'relative', backgroundColor: '#000', aspectRatio: '16/9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* VIDEO */}
        <video
          ref={videoRef}
          src={video.src}
          controls={hasStarted}
          controlsList="nodownload" 
          className="custom-fullscreen-video"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: !hasStarted ? 'blur(12px) brightness(0.7)' : 'none', transition: 'filter 0.5s ease-out' }}
          onTimeUpdate={handleTimeUpdate}
          onSeeking={handleSeeking}
          onRateChange={handleRateChange}
          preload="metadata"
        />

        {/* THUMBNAIL OVERLAY */}
        {!hasStarted && (
          <div 
            onClick={handlePlayClick}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
              background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8) 100%)',
              zIndex: 10
            }}
          >
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                          width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', 
                          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
            >
              <Play fill="#fff" color="#fff" size={32} style={{ marginLeft: '4px' }} />
            </div>
            
            <div style={{ padding: '24px 20px', color: '#fff' }}>
              <span className="badge badge-info" style={{ marginBottom: '8px', background: 'rgba(59,130,246,0.3)', backdropFilter: 'blur(4px)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                {video.category}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {video.title}
              </h3>
              {isStudent && (
                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '8px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                  🔒 Fast-forwarding and 1.5x+ speeds are restricted
                </p>
              )}
            </div>
          </div>
        )}

        {/* CUSTOM FULLSCREEN BUTTON OVERLAY */}
        {hasStarted && (
          <div style={{ position: 'absolute', bottom: isFullscreen ? '20px' : '4px', right: isFullscreen ? '20px' : '10px', zIndex: 50 }}>
            <button 
              onClick={toggleFullscreen}
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: '#fff',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        )}

        {/* AI CHATBOT INTEGRATION */}
        {hasStarted && (
          <VideoAIChatbot videoTitle={video.title} isStudent={isStudent} isFullscreen={isFullscreen} />
        )}
      </div>
      
      {/* Bottom Control Bar */}
      {hasStarted && isStudent && (
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
           <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{video.title}</span>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Playback Speed:</span>
             <select 
               style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.85rem', outline: 'none' }}
               onChange={(e) => {
                 if (videoRef.current) {
                   videoRef.current.playbackRate = parseFloat(e.target.value);
                 }
               }}
               defaultValue="1.0"
             >
                <option value="0.5">0.5x Tracker</option>
                <option value="0.75">0.75x Slow</option>
                <option value="1.0">1.0x Normal</option>
             </select>
           </div>
        </div>
      )}
      
      {hasStarted && !isStudent && (
        <div style={{ padding: '12px 16px', background: 'var(--bg-card)' }}>
           <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{video.title} — Mentor View (Unrestricted)</span>
        </div>
      )}
    </div>
  );
}
