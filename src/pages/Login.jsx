import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Heart, GraduationCap, Sparkles, Globe2, HeartHandshake, Quote } from 'lucide-react';

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
      <div className="login-shell animate-in">
        <div className="login-hero">
          <div className="login-hero-badge">
            <Sparkles size={16} />
            <span>Mentorship that scales impact</span>
          </div>

          <div className="login-logo">
            <div className="login-logo-icon">YN</div>
            <div>
              <div className="login-logo-text">Youngisthan Nexus</div>
              <div className="login-hero-subtitle">An NGO mentorship platform for structured learning, real outcomes, and dignified support.</div>
            </div>
          </div>

          <div className="login-hero-cards">
            <div className="login-mini-card">
              <div className="login-mini-icon"><HeartHandshake size={18} /></div>
              <div>
                <div className="login-mini-title">Human-first programs</div>
                <div className="login-mini-desc">Connect mentors and students with clarity and care.</div>
              </div>
            </div>
            <div className="login-mini-card">
              <div className="login-mini-icon"><Globe2 size={18} /></div>
              <div>
                <div className="login-mini-title">Measure real reach</div>
                <div className="login-mini-desc">Track progress, sessions, and geographic growth.</div>
              </div>
            </div>
            <div className="login-mini-card">
              <div className="login-mini-icon"><Quote size={18} /></div>
              <div>
                <div className="login-mini-quote">“When learning feels safe, it becomes unstoppable.”</div>
                <div className="login-mini-desc">— Youngisthan programs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-panel-header">
            <div className="login-panel-title">Continue as</div>
            <div className="login-panel-subtitle">Pick your role to enter the dashboard</div>
          </div>

          <div className="login-roles">
            {roles.map(role => (
              <button key={role.key} className="login-role-card" onClick={() => handleLogin(role)} type="button">
                <div className={`role-icon ${role.cls}`}>
                  <role.icon size={28} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div className="role-name">{role.label}</div>
                  <div className="role-desc">{role.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="login-panel-footer">
            <span className="login-footnote">
              Tip: Students can open the AI Tutor anytime from the floating widget.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
