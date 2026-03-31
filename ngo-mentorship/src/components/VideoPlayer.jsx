import { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export default function VideoPlayer({ video, isStudent }) {
  const videoRef = useRef(null);
  const [maxTime, setMaxTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    // Buffer allowance context (seeking sometimes triggers minute skips)
    if (currentTime > maxTime) {
      setMaxTime(currentTime);
    }
  };

  const handleSeeking = () => {
    if (!isStudent || !videoRef.current) return;
    // Allow a small buffer (0.5s) to avoid micro-stutters when seeking back and forth near the edge
    if (videoRef.current.currentTime > maxTime + 0.5) {
      // User is trying to skip ahead into unseen territory - force them back to max watched time
      videoRef.current.currentTime = maxTime;
    }
  };

  const handleRateChange = () => {
    if (!isStudent || !videoRef.current) return;
    if (videoRef.current.playbackRate > 1.0) {
      // Force rate back to 1 if default controls are used maliciously
      videoRef.current.playbackRate = 1.0;
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setHasStarted(true);
    }
  };

  return (
    <div className="card" style={{ padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
      {/* Container forcing a 16:9 aspect ratio roughly */}
      <div style={{ position: 'relative', backgroundColor: '#000', aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          src={video.src}
          controls={hasStarted}
          controlsList="nodownload" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: !hasStarted ? 'blur(12px) brightness(0.7)' : 'none', transition: 'filter 0.5s ease-out' }}
          onTimeUpdate={handleTimeUpdate}
          onSeeking={handleSeeking}
          onRateChange={handleRateChange}
          preload="metadata"
        />

        {!hasStarted && (
          <div 
            onClick={handlePlayClick}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
              // Subtle gradient overlay for readability
              background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8) 100%)'
            }}
          >
            {/* Centered Play Button */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                          width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', 
                          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
            >
              <Play fill="#fff" color="#fff" size={32} style={{ marginLeft: '4px' }} />
            </div>
            
            {/* Title Banner */}
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
      </div>
      
      {/* Bottom Control Bar explicitly showing speed constraints */}
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
