import { useState } from 'react';
import { Send, Paperclip, Users as UsersIcon } from 'lucide-react';
import { students, mentors, chatMessages } from '../../data/mockData';

export default function MentorChat() {
  const mentor = mentors[0];
  const myStudents = students.filter(s => s.assignedMentorId === mentor.id);
  const [selectedStudent, setSelectedStudent] = useState(myStudents[0]);
  const [messages, setMessages] = useState(chatMessages);
  const [newMsg, setNewMsg] = useState('');
  const [tab, setTab] = useState('direct');

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: `c${Date.now()}`, senderId: 'u2', receiverId: selectedStudent?.userId, type: 'direct', message: newMsg, timestamp: new Date().toISOString(), readBy: ['u2'] }]);
    setNewMsg('');
  };

  return (
    <div className="animate-in">
      <h1 className="page-title">Chat</h1>
      <p className="page-subtitle" style={{ marginBottom: '16px' }}>Message your students directly or in groups</p>

      <div className="tabs" style={{ marginBottom: 0 }}>
        <button className={`tab ${tab === 'direct' ? 'active' : ''}`} onClick={() => setTab('direct')}>Direct Messages</button>
        <button className={`tab ${tab === 'group' ? 'active' : ''}`} onClick={() => setTab('group')}>Group Chat</button>
      </div>

      <div className="chat-layout">
        <div className="chat-contacts">
          <div className="chat-contacts-header">{tab === 'direct' ? 'Students' : 'Groups'}</div>
          {tab === 'direct' ? myStudents.map(s => (
            <div key={s.id} className={`chat-contact ${selectedStudent?.id === s.id ? 'active' : ''}`} onClick={() => setSelectedStudent(s)}>
              <div className="chat-contact-avatar">{s.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="chat-contact-info">
                <div className="chat-contact-name">{s.name}</div>
                <div className="chat-contact-preview">{s.needs.join(', ')}</div>
              </div>
            </div>
          )) : (
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
              {tab === 'direct' ? selectedStudent?.name.split(' ').map(n => n[0]).join('') : <UsersIcon size={14} />}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tab === 'direct' ? selectedStudent?.name : 'All Mentees Group'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tab === 'direct' ? 'Online' : `${myStudents.length} members`}</div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.senderId === 'u2' ? 'sent' : 'received'}`}>
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
