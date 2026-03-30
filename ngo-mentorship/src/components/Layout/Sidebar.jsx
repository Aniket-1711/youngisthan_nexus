import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, Upload, Zap, FileBarChart,
  Activity, MessageSquare, Settings, BookOpen, Calendar, UserCheck, LogOut
} from 'lucide-react';

const adminLinks = [
  { section: 'Overview', items: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { section: 'Management', items: [
    { to: '/admin/mentors', icon: Users, label: 'Mentor Management' },
    { to: '/admin/training', icon: BookOpen, label: 'Training Center' },
  ]},
  { section: 'Assignment', items: [
    { to: '/admin/upload', icon: Upload, label: 'Bulk Upload' },
    { to: '/admin/assignment', icon: Zap, label: 'Auto-Assignment', badge: '3' },
  ]},
  { section: 'Analytics', items: [
    { to: '/admin/progress', icon: Activity, label: 'Monitor Progress' },
    { to: '/admin/reports', icon: FileBarChart, label: 'Reports' },
  ]},
  { section: 'Communication', items: [
    { to: '/admin/chat', icon: MessageSquare, label: 'Chat Monitor' },
  ]},
];

const mentorLinks = [
  { section: 'Overview', items: [
    { to: '/mentor', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { section: 'Mentoring', items: [
    { to: '/mentor/mentees', icon: GraduationCap, label: 'My Mentees' },
    { to: '/mentor/sessions', icon: Calendar, label: 'Sessions' },
    { to: '/mentor/training', icon: BookOpen, label: 'Training' },
  ]},
  { section: 'Communication', items: [
    { to: '/mentor/chat', icon: MessageSquare, label: 'Chat', badge: '5' },
  ]},
];

const studentLinks = [
  { section: 'Overview', items: [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { section: 'Learning', items: [
    { to: '/student/resources', icon: BookOpen, label: 'Resources' },
    { to: '/student/progress', icon: Activity, label: 'My Progress' },
  ]},
  { section: 'Communication', items: [
    { to: '/student/chat', icon: MessageSquare, label: 'Chat', badge: '2' },
  ]},
];

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const linkMap = {
    ngo_admin: adminLinks,
    mentor: mentorLinks,
    student: studentLinks,
  };

  const navSections = linkMap[currentUser?.role] || [];

  const isActive = (to) => {
    if (to === '/admin' || to === '/mentor' || to === '/student') {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99, display: 'none'
      }} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">MB</div>
          <span className="sidebar-logo-text">MentorBridge</span>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin' || item.to === '/mentor' || item.to === '/student'}
                  className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={18} />
                  {item.label}
                  {item.badge && <span className="link-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={logout}>
            <div className="sidebar-avatar">{currentUser?.avatar}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser?.name}</div>
              <div className="sidebar-user-role">{currentUser?.role?.replace('_', ' ')}</div>
            </div>
            <LogOut size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </aside>
    </>
  );
}
