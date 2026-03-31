import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Heart, GraduationCap } from 'lucide-react';

const roles = [
  { key: 'ngo_admin', label: 'NGO Admin', desc: 'Manage mentors, students, and analytics. Full platform control.', icon: Shield, cls: 'admin', path: '/admin' },
  { key: 'mentor', label: 'Mentor', desc: 'View mentees, conduct sessions, track progress and communicate.', icon: Heart, cls: 'mentor', path: '/mentor' },
  { key: 'student', label: 'Student', desc: 'Access learning resources, view mentor info and track progress.', icon: GraduationCap, cls: 'student', path: '/student' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role.key);
    navigate(role.path);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-container animate-in">
        <div className="login-logo">
          <div className="login-logo-icon">YN</div>
          <span className="login-logo-text">Youngisthan Nexus</span>
        </div>
        <p className="login-subtitle">NGO Mentorship Management Platform — Select your role to continue</p>
        <div className="login-roles">
          {roles.map(role => (
            <div key={role.key} className="login-role-card" onClick={() => handleLogin(role)}>
              <div className={`role-icon ${role.cls}`}>
                <role.icon size={28} />
              </div>
              <div className="role-name">{role.label}</div>
              <div className="role-desc">{role.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
