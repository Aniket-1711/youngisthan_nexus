import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

const sampleStudents = [
  { name: 'Ananya Iyer', age: 13, gender: 'female', needs: 'Mathematics', city: 'Chennai', school: 'Govt Girls School' },
  { name: 'Vishal Thakur', age: 15, gender: 'male', needs: 'Science, English', city: 'Delhi', school: 'DAV Public School' },
  { name: 'Pooja Devi', age: 11, gender: 'female', needs: 'Mental Health', city: 'Jaipur', school: 'ZP School' },
];

export default function BulkUpload() {
  const [tab, setTab] = useState('students');
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="animate-in">
      <h1 className="page-title">Bulk Upload</h1>
      <p className="page-subtitle">Upload student and mentor data via Excel spreadsheets</p>

      <div className="tabs">
        <button className={`tab ${tab === 'students' ? 'active' : ''}`} onClick={() => { setTab('students'); setUploaded(false); }}>Upload Students</button>
        <button className={`tab ${tab === 'mentors' ? 'active' : ''}`} onClick={() => { setTab('mentors'); setUploaded(false); }}>Upload Mentors</button>
      </div>

      {!uploaded ? (
        <div className="upload-zone" onClick={() => setUploaded(true)}>
          <Upload size={40} />
          <p>Drag and drop your <strong>{tab === 'students' ? 'Student' : 'Mentor'}</strong> Excel file here</p>
          <p>or <span>browse files</span></p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>Supports .xlsx, .xls files up to 10MB</p>
        </div>
      ) : (
        <div>
          <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{tab}_data_march2026.xlsx</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>3 records parsed · 2.4 KB</div>
            </div>
            <span className="badge badge-active"><CheckCircle size={12} /> Validated</span>
          </div>

          <div className="data-table-wrapper">
            <div className="data-table-header">
              <div className="data-table-title">Preview Data</div>
              <div className="data-table-actions">
                <span style={{ fontSize: '0.82rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> 3 valid</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> 0 errors</span>
              </div>
            </div>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Needs</th><th>City</th><th>School</th></tr></thead>
              <tbody>
                {sampleStudents.map((s, i) => (
                  <tr key={i}><td>{s.name}</td><td>{s.age}</td><td>{s.gender}</td><td>{s.needs}</td><td>{s.city}</td><td>{s.school}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => setUploaded(false)}>Confirm & Upload</button>
            <button className="btn btn-secondary" onClick={() => setUploaded(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
