import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Plus, Star, MoreVertical, X, UserCheck, AlertTriangle, Ban } from 'lucide-react';

const statusConfig = {
  active: { label: 'Active', cls: 'badge-active' },
  verified: { label: 'Verified', cls: 'badge-active' },
  unverified: { label: 'Pending Verification', cls: 'badge-warning' },
  pending_training: { label: 'Pending Training', cls: 'badge-pending' },
  warning: { label: 'Warning', cls: 'badge-warning' },
  suspended: { label: 'Suspended', cls: 'badge-danger' },
  removed: { label: 'Removed', cls: 'badge-danger' },
};

export default function MentorManagement() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  // Form State for new mentor matching Supabase columns exactly
  const initialFormState = {
    full_name: '',
    email: '',
    contact_number: '',
    age: '',
    gender: 'male',
    subjects_can_teach: '',
    education_level: '',
    experience_years: '',
    max_students: 10,
    preferred_student_location: '',
    available_for_online: 'Yes',
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      // Order by created_at descending so the newest are ALWAYS at the top
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setMentors(data || []);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMentor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Map to exact Supabase schema formats
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        contact_number: formData.contact_number,
        age: parseInt(formData.age) || null,
        gender: formData.gender,
        subjects_can_teach: formData.subjects_can_teach,
        education_level: formData.education_level,
        experience_years: parseInt(formData.experience_years) || 0,
        max_students: parseInt(formData.max_students) || 10,
        current_assigned_students: 0,
        preferred_student_location: formData.preferred_student_location,
        available_for_online: formData.available_for_online,
        verification_status: 'unverified',
        rating: 0
      };

      const { error } = await supabase.from('mentors').insert([payload]);
      
      if (error) throw error;
      
      // Reset form, close modal, refresh list
      setFormData(initialFormState);
      setShowAddModal(false);
      await fetchMentors();
      
    } catch (err) {
      console.error('Error adding mentor:', err);
      alert('Failed to add mentor: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyMentor = async (mentorId) => {
    try {
      const { error } = await supabase
        .from('mentors')
        .update({ verification_status: 'verified' })
        .eq('mentor_id', mentorId);
        
      if (error) throw error;
      
      // Refresh the table to show the new green Verified status
      await fetchMentors();
    } catch (err) {
      console.error('Error verifying mentor:', err);
      alert('Failed to verify mentor: ' + err.message);
    }
  };

  const filtered = mentors.filter(m => {
    const normalizedSearch = search.toLowerCase();
    const matchSearch = (m.full_name || '').toLowerCase().includes(normalizedSearch) || 
                        (m.subjects_can_teach || '').toLowerCase().includes(normalizedSearch);
    
    // Fallback status to unverified if none exists
    const status = m.verification_status || 'unverified';
    const matchFilter = filter === 'all' || status === filter;
    
    return matchSearch && matchFilter;
  });

  return (
    <>
      <div className="animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 className="page-title">Mentor Management</h1>
            <p className="page-subtitle">{mentors.length} mentors registered · {mentors.filter(m => ['active', 'verified'].includes(m.verification_status)).length} verified</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Mentor
          </button>
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
                <option value="verified">Verified / Active</option>
                <option value="unverified">Pending Verification</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Skills / Subjects</th>
                <th>Location</th>
                <th>Students</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>Loading mentors...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>No mentors found.</td></tr>
              ) : filtered.map(m => {
                const status = m.verification_status || 'unverified';
                const sc = statusConfig[status] || { label: status, cls: 'badge-info' };
                const initial = (m.full_name || 'U').charAt(0).toUpperCase();
                const subjectsArr = m.subjects_can_teach ? m.subjects_can_teach.split(',').map(s => s.trim()) : [];
                
                return (
                  <tr key={m.mentor_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                          {initial}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{m.full_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {subjectsArr.length > 0 ? subjectsArr.map(s => <span key={s} className="badge badge-info">{s}</span>) : <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>Not specified</span>}
                      </div>
                    </td>
                    <td>{m.preferred_student_location || 'Remote/Any'}</td>
                    <td>{m.current_assigned_students || 0}/{m.max_students || 10}</td>
                    <td>
                      {m.rating ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} /> {m.rating}
                        </span>
                      ) : <span style={{color: 'var(--text-muted)'}}>—</span>}
                    </td>
                    <td><span className={`badge ${sc.cls}`}>{sc.label}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {status !== 'verified' && (
                          <button className="btn btn-secondary btn-sm" title="Verify Mentor" onClick={() => handleVerifyMentor(m.mentor_id)}>
                            <UserCheck size={14} />
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" title="Suspend"><AlertTriangle size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', width: '90%' }}>
            <div className="modal-header">
              <h3>Add New Mentor</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddMentor}>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input required name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="Enter full name" />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="mentor@email.com" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input required name="contact_number" value={formData.contact_number} onChange={handleInputChange} placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g. 28" />
                  </div>
                  <div className="form-group">
                    <label>Education Level</label>
                    <input name="education_level" value={formData.education_level} onChange={handleInputChange} placeholder="e.g. Bachelors, Masters" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subjects Can Teach (comma-separated) *</label>
                  <input required name="subjects_can_teach" value={formData.subjects_can_teach} onChange={handleInputChange} placeholder="Mathematics, Science, English" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Preferred Target Location</label>
                    <input name="preferred_student_location" value={formData.preferred_student_location} onChange={handleInputChange} placeholder="e.g. Bangalore Urban" />
                  </div>
                  <div className="form-group">
                    <label>Available for Online Mentorship?</label>
                    <select name="available_for_online" value={formData.available_for_online} onChange={handleInputChange}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Experience Years</label>
                    <input type="number" name="experience_years" value={formData.experience_years} onChange={handleInputChange} placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label>Max Students Count</label>
                    <input type="number" min="1" max="50" name="max_students" value={formData.max_students} onChange={handleInputChange} placeholder="10" />
                  </div>
                </div>
                
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add Mentor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
