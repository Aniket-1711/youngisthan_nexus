import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react';
import { generatedReports } from '../../data/mockData';

export default function Reports() {
  const [reportType, setReportType] = useState('comprehensive');

  const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  const typeLabels = { comprehensive: 'Comprehensive', mentor_performance: 'Mentor Performance', student_progress: 'Student Progress', analytics: 'Analytics' };

  return (
    <div className="animate-in">
      <h1 className="page-title">Reports</h1>
      <p className="page-subtitle">Generate and download platform analytics reports</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Generate New Report</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="comprehensive">Comprehensive</option>
              <option value="mentor_performance">Mentor Performance</option>
              <option value="student_progress">Student Progress</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}><label>Start Date</label><input type="date" defaultValue="2026-03-01" /></div>
          <div className="form-group" style={{ margin: 0 }}><label>End Date</label><input type="date" defaultValue="2026-03-30" /></div>
          <div className="form-group" style={{ margin: 0 }}><label>Format</label>
            <select><option value="pdf">PDF</option><option value="excel">Excel</option></select>
          </div>
        </div>
        <button className="btn btn-primary"><Download size={16} /> Generate Report</button>
      </div>

      <div className="data-table-wrapper">
        <div className="data-table-header"><div className="data-table-title">Download History</div></div>
        <table className="data-table">
          <thead><tr><th>Report</th><th>Type</th><th>Date Range</th><th>Size</th><th>Generated</th><th>Action</th></tr></thead>
          <tbody>
            {generatedReports.map(r => (
              <tr key={r.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {r.format === 'pdf' ? <FileText size={18} style={{ color: 'var(--danger)' }} /> : <FileSpreadsheet size={18} style={{ color: 'var(--success)' }} />}
                  <span style={{ fontWeight: 600 }}>{typeLabels[r.reportType]} Report</span>
                </td>
                <td><span className="badge badge-info">{r.format.toUpperCase()}</span></td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {r.filters.dateRange.start} → {r.filters.dateRange.end}
                </td>
                <td>{formatSize(r.fileSize)}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{r.generatedAt}</td>
                <td><button className="btn btn-secondary btn-sm"><Download size={14} /> Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
