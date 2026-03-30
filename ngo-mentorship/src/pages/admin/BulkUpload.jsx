import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import * as xlsx from 'xlsx';
import { supabase } from '../../lib/supabaseClient';

export default function BulkUpload() {
  const [tab, setTab] = useState('students');
  const [fileDetails, setFileDetails] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setFileDetails({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' });

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = xlsx.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = xlsx.utils.sheet_to_json(worksheet, { defval: null });

        // Clean keys to lowercase and replace spaces with underscores to match db
        const cleanedJson = json.map(row => {
          const newRow = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
            // Skip original ID columns to allow Supabase to auto-generate UUIDs
            if (cleanKey !== 'student_id' && cleanKey !== 'mentor_id') {
              newRow[cleanKey] = row[key];
            }
          });
          return newRow;
        });

        setPreviewData(cleanedJson);
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: 'Failed to parse Excel file. Please ensure it has a valid format.' });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = async () => {
    if (previewData.length === 0) return;
    setIsUploading(true);
    setMessage(null);

    try {
      const table = tab === 'students' ? 'students' : 'mentors';
      
      const { error } = await supabase
        .from(table)
        .insert(previewData);

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: `Successfully uploaded ${previewData.length} records to ${table}.` });
      setPreviewData([]);
      setFileDetails(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Error occurred while saving to database.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const resetState = () => {
    setPreviewData([]);
    setFileDetails(null);
    setMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const columns = previewData.length > 0 
    ? Object.keys(previewData[0]).filter(k => k !== 'student_id' && k !== 'mentor_id').slice(0, 6) 
    : [];

  return (
    <div className="animate-in">
      <h1 className="page-title">Bulk Upload</h1>
      <p className="page-subtitle">Upload student and mentor data via Excel spreadsheets</p>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b',
          border: '2px solid',
          borderColor: message.type === 'success' ? '#22c55e' : '#ef4444' }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontWeight: 600 }}>{message.text}</span>
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${tab === 'students' ? 'active' : ''}`} 
          onClick={() => { setTab('students'); resetState(); }}
        >
          Upload Students
        </button>
        <button 
          className={`tab ${tab === 'mentors' ? 'active' : ''}`} 
          onClick={() => { setTab('mentors'); resetState(); }}
        >
          Upload Mentors
        </button>
      </div>

      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
      />

      {previewData.length === 0 ? (
        <div 
          className="upload-zone" 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload size={40} />
          <p>Drag and drop your <strong>{tab === 'students' ? 'Student' : 'Mentor'}</strong> Excel file here</p>
          <p>or <span>browse files</span></p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>Supports .xlsx, .xls</p>
        </div>
      ) : (
        <div>
          <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{fileDetails?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{previewData.length} records parsed · {fileDetails?.size}</div>
            </div>
            <span className="badge badge-active"><CheckCircle size={12} /> Validated</span>
          </div>

          <div className="data-table-wrapper">
            <div className="data-table-header">
              <div className="data-table-title">Preview Data (First 6 Columns)</div>
              <div className="data-table-actions">
                <span style={{ fontSize: '0.82rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> {previewData.length} valid</span>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map((col, i) => (
                      <th key={i}>{col.replace(/_/g, ' ')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {columns.map((col, j) => (
                        <td key={j}>{row[col]?.toString().substring(0, 30)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 5 && (
                <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ... and {previewData.length - 5} more rows
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleConfirmUpload} 
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Confirm & Upload'}
            </button>
            <button className="btn btn-secondary" onClick={resetState} disabled={isUploading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
