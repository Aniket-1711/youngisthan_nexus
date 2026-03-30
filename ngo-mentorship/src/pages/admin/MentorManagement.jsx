import { useState } from 'react';
import { mentors } from '../../data/mockData';
import { Search, Plus, Star, MoreVertical, X, UserCheck, AlertTriangle, Ban } from 'lucide-react';

const statusConfig = {
  active: { label: 'Active', cls: 'badge-active' },
  pending_training: { label: 'Pending Training', cls: 'badge-pending' },
  warning: { label: 'Warning', cls: 'badge-warning' },
  suspended: { label: 'Suspended', cls: 'badge-danger' },
  removed: { label: 'Removed', cls: 'badge-danger' },
};

export default function MentorManagement() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = mentors.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.skills.join(' ').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Mentor Management</h1>
          <p className="page-subtitle">{mentors.length} mentors registered · {mentors.filter(m => m.status === 'active').length} active</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Mentor</button>
      </div>

      <div className="data-table-wrapper">
        <div className="data-table-header">
          <div className="data-table-actions">
            <div className="search-box" style={{ width: '240px' }}>
              <Search size={16} />
              <input placeholder="Search mentors..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending_training">Pending Training</option>
              <option value="warning">Warning</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mentor</th>
              <th>Skills</th>
              <th>Location</th>
              <th>Students</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const sc = statusConfig[m.status];
              return (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {m.skills.map(s => <span key={s} className="badge badge-info">{s}</span>)}
                    </div>
                  </td>
                  <td>{m.location.city} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({m.location.area})</span></td>
                  <td>{m.currentStudents}/{m.maxStudents}</td>
                  <td>
                    {m.performanceRating > 0 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} /> {m.performanceRating}
                      </span>
                    ) : '—'}
                  </td>
                  <td><span className={`badge ${sc.cls}`}>{sc.label}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" title="View"><UserCheck size={14} /></button>
                      {m.status === 'active' && <button className="btn btn-danger btn-sm" title="Warn"><AlertTriangle size={14} /></button>}
                      {m.status === 'warning' && <button className="btn btn-danger btn-sm" title="Suspend"><Ban size={14} /></button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Mentor</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Full Name</label><input placeholder="Enter full name" /></div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="mentor@email.com" /></div>
              <div className="form-group"><label>Phone</label><input placeholder="+91 98765 43210" /></div>
              <div className="form-group"><label>Skills (comma-separated)</label><input placeholder="Mathematics, Science, Career Guidance" /></div>
              <div className="form-group">
                <label>Gender</label>
                <select><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
              </div>
              <div className="form-group">
                <label>Preferred Timing</label>
                <select><option value="both">Both</option><option value="weekday_online">Weekday Online</option><option value="weekend_offline">Weekend Offline</option></select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label>City</label><input placeholder="Delhi" /></div>
                <div className="form-group"><label>Area Type</label><select><option value="urban">Urban</option><option value="rural">Rural</option></select></div>
              </div>
              <div className="form-group"><label>Max Students</label><input type="number" placeholder="10" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowAddModal(false)}>Add Mentor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
