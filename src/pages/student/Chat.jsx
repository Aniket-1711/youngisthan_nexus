import { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { mentors, chatMessages } from '../../data/mockData';

export default function StudentChat() {
  const mentor = mentors[0];
  const [messages, setMessages] = useState(chatMessages);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: `c${Date.now()}`, senderId: 'u3', receiverId: 'u2', type: 'direct', message: newMsg, timestamp: new Date().toISOString(), readBy: ['u3'] }]);
    setNewMsg('');
  };

  return (
    <div className="animate-in">
      <h1 className="page-title">Chat with Mentor</h1>
      <p className="page-subtitle" style={{ marginBottom: '16px' }}>Message {mentor.name}</p>

      <div className="chat-layout" style={{ gridTemplateColumns: '1fr' }}>
        <div className="chat-main">
          <div className="chat-main-header">
            <div className="chat-contact-avatar" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{mentor.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>● Online</div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.senderId === 'u3' ? 'sent' : 'received'}`}>
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
