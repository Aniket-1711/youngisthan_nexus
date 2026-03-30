import { Users, GraduationCap, MapPin, School, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { dashboardStats, enrollmentTrend, sessionCompletionData, cityDistribution, recentActivity } from '../../data/mockData';

const stats = [
  { label: 'Total Students', value: dashboardStats.totalStudents, icon: GraduationCap, color: 'var(--info)', bg: 'rgba(59,130,246,0.12)', trend: '+18', up: true },
  { label: 'Active Mentors', value: dashboardStats.activeMentors, icon: Users, color: 'var(--accent)', bg: 'rgba(20,184,166,0.12)', trend: '+3', up: true },
  { label: 'Mentor:Student', value: dashboardStats.mentorStudentRatio, icon: Activity, color: 'var(--purple)', bg: 'rgba(168,85,247,0.12)', trend: 'Optimal', up: true },
  { label: 'Cities Reached', value: dashboardStats.citiesReached, icon: MapPin, color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)', trend: '+2', up: true },
  { label: 'Schools Reached', value: dashboardStats.schoolsReached, icon: School, color: 'var(--success)', bg: 'rgba(34,197,94,0.12)', trend: '+4', up: true },
];

const chartTooltipStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.82rem' };

export default function AdminDashboard() {
  return (
    <div className="animate-in">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back, Dr. Kavitha. Here's your platform overview.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(s => (
          <div key={s.label} className="stats-card">
            <div className="stats-icon" style={{ background: s.bg, color: s.color }}>
              <s.icon size={22} />
            </div>
            <div className="stats-info">
              <div className="stats-label">{s.label}</div>
              <div className="stats-value">{s.value}</div>
              <div className={`stats-trend ${s.up ? 'up' : 'down'}`}>
                {s.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {s.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Enrollment Growth</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={enrollmentTrend}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="students" stroke="#14b8a6" fill="url(#colorStudents)" strokeWidth={2} />
              <Area type="monotone" dataKey="mentors" stroke="#a855f7" fill="rgba(168,85,247,0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Session Completion</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sessionCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="scheduled" fill="rgba(139,154,181,0.3)" radius={[4,4,0,0]} />
              <Bar dataKey="completed" fill="#14b8a6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Geographic Distribution</h3>
          </div>
          <div style={{ height: '320px' }}>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', background: 'var(--bg-secondary)' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap' />
              {cityDistribution.map(city => (
                <CircleMarker key={city.city} center={[city.lat, city.lng]} radius={Math.max(city.students / 3, 6)} pathOptions={{ color: '#14b8a6', fillColor: '#14b8a6', fillOpacity: 0.5 }}>
                  <Popup><strong>{city.city}</strong><br />{city.students} students · {city.mentors} mentors</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0,
                  background: item.type === 'success' ? 'var(--success)' : item.type === 'warning' ? 'var(--warning)' : 'var(--info)'
                }} />
                <div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{item.text}</p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
