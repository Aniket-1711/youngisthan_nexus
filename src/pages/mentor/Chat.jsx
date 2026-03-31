import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Paperclip, Users as UsersIcon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function MentorChat() {
  const location = useLocation();
  const [myStudents, setMyStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [tab, setTab] = useState('direct');
  const [loading, setLoading] = useState(true);

  const mentorName = 'Gaurav Hegde';

  useEffect(() => {
    async function fetchMentees() {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select(`
            id,
            student:students ( student_id, full_name, age, learning_needs, residence_type ),
            mentor:mentors!inner ( mentor_id, full_name )
          `)
          .eq('status', 'active')
          .eq('mentor.full_name', mentorName);
          
        if (error) throw error;
        
        const studentsArr = data ? data.map(d => d.student).filter(Boolean) : [];
        setMyStudents(studentsArr);
        
        if (studentsArr.length > 0) {
          // If navigated from MyMentees with a specific student, select them
          const targetId = location.state?.selectedStudentId;
          const targetStudent = targetId
            ? studentsArr.find(s => s.student_id === targetId)
            : null;
          setSelectedStudent(targetStudent || studentsArr[0]);
          // generate fake chat history
          setMessages([
            { id: 'c1', senderId: 'student', message: 'Hello sir! I had a doubt regarding our last session.', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'c2', senderId: 'mentor', message: 'Hi! Of course, what is your doubt?', timestamp: new Date(Date.now() - 3500000).toISOString() }
          ]);
        }
      } catch (err) {
        console.error("Error loading chat contacts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMentees();
  }, []);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { 
      id: `c${Date.now()}`, 
      senderId: 'mentor', 
      message: newMsg, 
      timestamp: new Date().toISOString() 
    }]);
    setNewMsg('');
  };

  return (
    <div className="animate-in">
      <h1 className="page-title">Chat <span style={{fontSize:'0.6em', color:'var(--text-muted)'}}>(Demo mode)</span></h1>
      <p className="page-subtitle" style={{ marginBottom: '16px' }}>Message your students directly or in groups</p>

      <div className="tabs" style={{ marginBottom: 0 }}>
        <button className={`tab ${tab === 'direct' ? 'active' : ''}`} onClick={() => setTab('direct')}>Direct Messages</button>
        <button className={`tab ${tab === 'group' ? 'active' : ''}`} onClick={() => setTab('group')}>Group Chat</button>
      </div>

      <div className="chat-layout">
        <div className="chat-contacts">
          <div className="chat-contacts-header">{tab === 'direct' ? 'Students' : 'Groups'}</div>
          {loading && <div style={{padding:'20px', color:'var(--text-muted)'}}>Loading contacts...</div>}
          {!loading && tab === 'direct' && myStudents.length === 0 && <div style={{padding:'20px', color:'var(--text-muted)'}}>No active students.</div>}
          
          {!loading && tab === 'direct' ? myStudents.map(s => (
            <div key={s.student_id} className={`chat-contact ${selectedStudent?.student_id === s.student_id ? 'active' : ''}`} onClick={() => setSelectedStudent(s)}>
              <div className="chat-contact-avatar">{(s.full_name || 'U').charAt(0).toUpperCase()}</div>
              <div className="chat-contact-info">
                <div className="chat-contact-name">{s.full_name}</div>
                <div className="chat-contact-preview">{s.learning_needs || 'General'}</div>
              </div>
            </div>
          )) : !loading && (
            <div className="chat-contact active">
              <div className="chat-contact-avatar" style={{ background: 'rgba(168,85,247,0.3)', color: 'var(--purple)' }}><UsersIcon size={18} /></div>
              <div className="chat-contact-info">
                <div className="chat-contact-name">All Mentees</div>
                <div className="chat-contact-preview">{myStudents.length} members</div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-main">
          <div className="chat-main-header">
            <div className="chat-contact-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
              {tab === 'direct' ? (selectedStudent?.full_name || 'U').charAt(0).toUpperCase() : <UsersIcon size={14} />}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tab === 'direct' ? selectedStudent?.full_name : 'All Mentees Group'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tab === 'direct' ? 'Online' : `${myStudents.length} members`}</div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={Math.random()} className={`chat-msg ${msg.senderId === 'mentor' ? 'sent' : 'received'}`}>
                <div>{msg.message}</div>
                <div className="chat-msg-time">{new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <button className="btn btn-secondary btn-sm"><Paperclip size={16} /></button>
            <input placeholder="Type a message..." value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
            <button className="btn btn-primary btn-sm" onClick={handleSend}><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
