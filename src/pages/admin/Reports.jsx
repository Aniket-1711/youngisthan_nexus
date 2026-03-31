import { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react';
import { generatedReports } from '../../data/mockData';
import { supabase } from '../../lib/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports() {
  const [reportType, setReportType] = useState('comprehensive');
  const [downloading, setDownloading] = useState(false);

  const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  const typeLabels = { comprehensive: 'Comprehensive', mentor_performance: 'Mentor Performance', student_progress: 'Student Progress', analytics: 'Analytics' };

  // Re-used exact PDF implementation from AutoAssignment
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // 1. Fetch live assignments
      const { data: assignmentsData, error } = await supabase
        .from('assignments')
        .select(`
          id,
          status,
          match_score,
          assigned_by,
          other_allocation,
          student:students ( student_id, full_name, age, learning_needs, residence_type ),
          mentor:mentors ( mentor_id, full_name, subjects_can_teach )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const assignments = assignmentsData || [];

      // 2. Generate exactly the same PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Mentor-Student Assignments Report', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

      const tableColumn = ["Student Name", "Age", "Needs", "Mentor Name", "Match Score", "Status"];
      const tableRows = [];

      assignments.forEach(a => {
        const studentData = [
          a.student?.full_name || 'N/A',
          a.student?.age || 'N/A',
          a.student?.learning_needs || 'N/A',
          a.mentor?.full_name || 'N/A',
          `${a.match_score || 0}%`,
          a.status
        ];
        tableRows.push(studentData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      });

      doc.save('mentor_assignments_report.pdf');
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

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
        <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={downloading}>
          <Download size={16} /> {downloading ? 'Compiling PDF...' : 'Generate Report'}
        </button>
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
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={handleDownloadPDF} disabled={downloading}>
                    <Download size={14} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
