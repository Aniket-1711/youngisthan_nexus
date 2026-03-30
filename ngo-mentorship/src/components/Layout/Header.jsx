import { useState } from 'react';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notifications } from '../../data/mockData';

export default function Header({ onToggleSidebar, isLightMode, toggleLightMode }) {
  const { currentUser } = useAuth();
  const [showNotif, setShowNotif] = useState(false);

  const userNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  const getNotifColor = (type) => {
    const colors = { assignment: 'var(--info)', session_reminder: 'var(--accent)', progress_update: 'var(--success)', warning: 'var(--warning)', system: 'var(--purple)' };
    return colors[type] || 'var(--text-muted)';
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onToggleSidebar}><Menu size={22} /></button>
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search mentors, students, sessions..." />
        </div>
      </div>
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center' }}>
        {currentUser?.role === 'ngo_admin' && (
          <button className="notif-btn" onClick={toggleLightMode} style={{ marginRight: '16px' }} title="Toggle Light/Dark Theme">
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        )}
        <div style={{ position: 'relative' }}>
          <button className="notif-btn" onClick={() => setShowNotif(!showNotif)}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
          </button>
          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">Notifications ({unreadCount} new)</div>
              {userNotifs.map(n => (
                <div key={n.id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                  <div className="notif-icon" style={{ background: `${getNotifColor(n.type)}20`, color: getNotifColor(n.type) }}>
                    <Bell size={16} />
                  </div>
                  <div className="notif-text">
                    <p><strong>{n.title}</strong></p>
                    <p>{n.message}</p>
                    <span>{timeAgo(n.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
