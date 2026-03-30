import { useState, useEffect } from 'react';
import { Zap, CheckCircle, Users, ArrowRight, Download, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AutoAssignment() {
  const [tab, setTab] = useState('results');
  const [running, setRunning] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manual Assignment States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assigningMentorId, setAssigningMentorId] = useState(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      // Fetch Assignments
      const { data: assignmentsData, error: aError } = await supabase
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

      if (aError) throw aError;
      setAssignments(assignmentsData || []);

      // Fetch unassigned students for the queue
      const assignedStudentIds = assignmentsData?.map(a => a.student?.student_id).filter(Boolean) || [];
      
      let query = supabase.from('students').select('*');
      if (assignedStudentIds.length > 0) {
        query = query.not('student_id', 'in', `(${assignedStudentIds.join(',')})`);
      }
      const { data: qData, error: qError } = await query;

      if (!qError) setQueue(qData || []);

      // Fetch all mentors for manual assignment sidebar
      const { data: mData } = await supabase.from('mentors').select('mentor_id, full_name, subjects_can_teach, max_students');
      setAllMentors(mData || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleRun = async () => {
    setRunning(true);
    try {
      // 1. Fetch unassigned students
      const { data: assignmentsData } = await supabase.from('assignments').select('student_id');
      const assignedStudentIds = assignmentsData?.map(a => a.student_id) || [];
      
      let sQuery = supabase.from('students').select('*');
      if (assignedStudentIds.length > 0) {
        sQuery = sQuery.not('student_id', 'in', `(${assignedStudentIds.join(',')})`);
      }
      const { data: studentsInfo } = await sQuery;

      // 2. Fetch all mentors and calculate their current load
      const { data: mentorsInfo } = await supabase.from('mentors').select('*');
      const { data: activeAssignments } = await supabase.from('assignments').select('mentor_id');
      
      const mentorLoad = {};
      mentorsInfo?.forEach(m => mentorLoad[m.mentor_id] = 0);
      activeAssignments?.forEach(a => {
        if (mentorLoad[a.mentor_id] !== undefined) {
          mentorLoad[a.mentor_id]++;
        }
      });

      if (!studentsInfo || !mentorsInfo || studentsInfo.length === 0) {
        setRunning(false);
        return; // nothing to do
      }

      const newAssignments = [];
      const studentsToProcess = [...studentsInfo];

      for (const student of studentsToProcess) {
        let bestMentorId = null;
        let matchScore = 0;
        let isTemp = false;
        
        // Find best match
        const availableMentors = mentorsInfo.filter(m => (mentorLoad[m.mentor_id] || 0) < (m.max_students || 20));

        if (availableMentors.length === 0) {
          break;
        }

        // Strict Matching
        for (const mentor of availableMentors) {
          let score = 50; // base score
          const needs = (student.learning_needs || '').toLowerCase();
          const subjects = (mentor.subjects_can_teach || '').toLowerCase();
          
          if (needs && subjects && subjects.includes(needs)) score += 30; // High priority Need match
          if (student.preferred_mentor_gender && mentor.gender && student.preferred_mentor_gender.toLowerCase() === mentor.gender.toLowerCase()) score += 20;

          if (score > matchScore) {
            matchScore = score;
            bestMentorId = mentor.mentor_id;
          }
        }

        if (bestMentorId && matchScore >= 70) {
          isTemp = false; 
        } else {
          // Assign temporary if match is weak
          bestMentorId = availableMentors[0].mentor_id;
          matchScore = 50;
          isTemp = true;
        }

        if (bestMentorId) {
          mentorLoad[bestMentorId]++;
          newAssignments.push({
            student_id: student.student_id,
            mentor_id: bestMentorId,
            match_score: matchScore,
            assigned_by: 'auto',
            status: isTemp ? 'temporary' : 'active'
          });
        }
      }

      if (newAssignments.length > 0) {
        await supabase.from('assignments').insert(newAssignments);
        await fetchAssignments();
      }

    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
      setTab('results');
    }
  };

  const downloadPDF = () => {
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
  };

  const handleManualAssign = async (mentorId) => {
    if (!selectedStudent || !selectedStudent.student_id || !mentorId) {
      alert("Missing data for assignment. Please refresh and try again.");
      return;
    }
    setAssigningMentorId(mentorId);
    
    try {
      const { data, error } = await supabase.from('assignments').insert([{
        student_id: selectedStudent.student_id,
        mentor_id: mentorId,
        match_score: 100, // Manual assignment implies perfect override
        assigned_by: 'manual',
        status: 'active',
        other_allocation: true // As requested, explicitly flag manual allocations
      }]).select(); // Add explicit .select() to ensure SDK resolves the row properly
      
      if (error) {
        throw new Error(error.message || JSON.stringify(error));
      }
      
      // Successfully inserted, refresh view
      setSelectedStudent(null);
      await fetchAssignments();
    } catch (err) {
      console.error("Manual assignment failed:", err);
      alert('Failed to manual assign! DB Error: ' + err.message);
    } finally {
      setAssigningMentorId(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '24px', position: 'relative', alignItems: 'flex-start' }}>
      
      {/* LEFT: MAIN CONTENT */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="page-title">Auto-Assignment Engine</h1>
              <p className="page-subtitle">Match students with mentors based on skills, preferences, and location</p>
            </div>
            <button className="btn btn-secondary" onClick={downloadPDF} disabled={assignments.length === 0}>
              <Download size={16} /> Export PDF
            </button>
          </div>

          <div className="tabs">
            <button className={`tab ${tab === 'results' ? 'active' : ''}`} onClick={() => setTab('results')}>Assignment Results</button>
            <button className={`tab ${tab === 'queue' ? 'active' : ''}`} onClick={() => setTab('queue')}>Others Queue ({queue.length})</button>
          </div>

          {tab === 'results' && (
            <div>
              <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Run Auto-Assignment</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Matches unassigned students with available trained mentors</p>
                </div>
                <button className="btn btn-primary" onClick={handleRun} disabled={running}>
                  {running ? <><span style={{ animation: 'pulse 1s infinite' }}>⚡</span> Running...</> : <><Zap size={16} /> Run Assignment</>}
                </button>
              </div>

              <div className="data-table-wrapper">
                <div className="data-table-header">
                  <div className="data-table-title">Recent Assignments</div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{assignments.length} pairs {loading && '(Loading...)'}</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead><tr><th>Student</th><th></th><th>Mentor</th><th>Match Score</th><th>Type</th><th>Status</th><th>Other Allocation</th></tr></thead>
                    <tbody>
                      {assignments.map(a => (
                        <tr key={a.id}>
                          <td style={{ fontWeight: 600 }}>{a.student?.full_name}</td>
                          <td><ArrowRight size={16} style={{ color: 'var(--text-muted)' }} /></td>
                          <td style={{ fontWeight: 600 }}>{a.mentor?.full_name}</td>
                          <td>
                            <span style={{ color: a.match_score >= 85 ? 'var(--success)' : a.match_score >= 70 ? 'var(--warning)' : 'var(--danger)', fontWeight: 700 }}>
                              {a.match_score}%
                            </span>
                          </td>
                          <td><span className={`badge ${a.assigned_by === 'auto' ? 'badge-info' : 'badge-purple'}`}>{a.assigned_by === 'manual' ? 'manual' : 'auto'}</span></td>
                          <td>
                            <span className={`badge ${a.status === 'active' ? 'badge-active' : 'badge-warning'}`}>
                              {a.status}
                            </span>
                          </td>
                          <td>
                            {a.other_allocation ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>Yes</span> : <span style={{ color: 'var(--text-muted)' }}>No</span>}
                          </td>
                        </tr>
                      ))}
                      {!loading && assignments.length === 0 && (
                         <tr><td colSpan="7" style={{textAlign: 'center', color: '#666', padding: '20px'}}>No assignments found. Run the engine to generate pairs.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'queue' && (
            <div className="data-table-wrapper">
              <div className="data-table-header">
                <div className="data-table-title">Unmatched Students</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Student</th><th>Age</th><th>Needs</th><th>Location</th><th>Action</th></tr></thead>
                  <tbody>
                    {queue.map(q => (
                      <tr key={q.student_id} style={{ backgroundColor: selectedStudent?.student_id === q.student_id ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                        <td style={{ fontWeight: 600 }}>{q.full_name}</td>
                        <td>{q.age || '-'}</td>
                        <td>{q.learning_needs || '-'}</td>
                        <td>{q.residence_type || '-'}</td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedStudent(q)}
                            disabled={selectedStudent?.student_id === q.student_id}
                          >
                            <Users size={14} /> Assign Manually
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!loading && queue.length === 0 && (
                         <tr><td colSpan="5" style={{textAlign: 'center', color: '#666', padding: '20px'}}>All students are currently assigned!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: MANUAL ASSIGNMENT SIDEBAR */}
      {selectedStudent && (
        <div style={{ 
          width: '380px', 
          flexShrink: 0, 
          position: 'sticky', 
          top: '24px', 
          maxHeight: 'calc(100vh - 48px)', // Keeps it within viewport
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-md)',
          animation: 'slideInRight 0.3s ease-out' 
        }}>
          {/* Sidebar Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigning Mentor To</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{selectedStudent.full_name}</h3>
            </div>
            <button 
              onClick={() => setSelectedStudent(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Body / Scrollable Mentor List */}
          <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Select a mentor from the list below to instantly group them.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allMentors.map(mentor => (
                <div key={mentor.mentor_id} className="card" style={{ padding: '16px', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{mentor.full_name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 600 }}>Subjects:</span> {mentor.subjects_can_teach || 'Any Subject'}
                  </div>
                  
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                    onClick={() => handleManualAssign(mentor.mentor_id)}
                    disabled={assigningMentorId === mentor.mentor_id}
                  >
                    {assigningMentorId === mentor.mentor_id ? 'Assigning...' : 'Select Mentor'}
                  </button>
                </div>
              ))}
              
              {allMentors.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No mentors available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Required CSS for sliding animation on sidebar creation */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
