import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, ArrowLeft, Phone, Video, MoreVertical, Check, CheckCheck, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mentors, chatMessages } from '../../data/mockData';

const EMOJI_LIST = ['👍', '❤️', '😊', '🎉', '🙏', '😂', '🔥', '💯', '✅', '📚', '🤔', '👏'];

const MENTOR_AUTO_REPLIES = [
  "That's a great question! Let me explain...",
  "You're making excellent progress, keep it up! 💪",
  "Try practicing problems 4-8 from the worksheet before our next session.",
  "I'll share some additional resources for this topic tomorrow.",
  "Remember, consistency is key. Even 20 minutes daily makes a big difference! 📚",
];

export default function StudentChat() {
  const navigate = useNavigate();
  const mentor = mentors[0];
  const [messages, setMessages] = useState(chatMessages);
  const [newMsg, setNewMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [onlineStatus] = useState('Online');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emojiRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmoji]);

  // Simulate mentor auto-reply
  const simulateMentorReply = () => {
    setIsTyping(true);
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      setIsTyping(false);
      const reply = MENTOR_AUTO_REPLIES[Math.floor(Math.random() * MENTOR_AUTO_REPLIES.length)];
      setMessages(prev => [...prev, {
        id: `c${Date.now()}`,
        senderId: 'u2',
        receiverId: 'u3',
        type: 'direct',
        message: reply,
        timestamp: new Date().toISOString(),
        readBy: ['u2']
      }]);
    }, delay);
  };

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const msg = {
      id: `c${Date.now()}`,
      senderId: 'u3',
      receiverId: 'u2',
      type: 'direct',
      message: newMsg,
      timestamp: new Date().toISOString(),
      readBy: ['u3']
    };
    setMessages(prev => [...prev, msg]);
    setNewMsg('');
    setShowEmoji(false);
    inputRef.current?.focus();

    // Auto-reply from mentor
    simulateMentorReply();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setNewMsg(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateSeparator = (ts) => {
    const date = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const getDateGroups = () => {
    const groups = [];
    let lastDate = '';
    messages.forEach(msg => {
      const msgDate = new Date(msg.timestamp).toDateString();
      if (msgDate !== lastDate) {
        groups.push({ type: 'date', label: formatDateSeparator(msg.timestamp) });
        lastDate = msgDate;
      }
      groups.push({ type: 'message', data: msg });
    });
    return groups;
  };

  return (
    <div className="animate-in" style={{ height: 'calc(100vh - var(--header-height) - 64px)' }}>
      {/* Chat Container */}
      <div className="chat-layout" style={{ gridTemplateColumns: '1fr', height: '100%' }}>
        <div className="chat-main" style={{ height: '100%' }}>

          {/* Enhanced Header */}
          <div className="chat-main-header" style={{ padding: '12px 24px', gap: '12px' }}>
            <button
              onClick={() => navigate('/student')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 10px', marginRight: '4px' }}
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="chat-contact-avatar" style={{
              width: '42px', height: '42px', fontSize: '0.85rem',
              position: 'relative'
            }}>
              {mentor.name.split(' ').map(n => n[0]).join('')}
              <span style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: 'var(--success)', border: '2px solid var(--bg-card)',
                animation: 'pulse-online 2s infinite'
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{mentor.name}</div>
              <div style={{
                fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--success)', display: 'inline-block'
                }} />
                {onlineStatus}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" style={{ padding: '8px' }} title="Voice Call">
                <Phone size={16} />
              </button>
              <button className="btn btn-secondary btn-sm" style={{ padding: '8px' }} title="Video Call">
                <Video size={16} />
              </button>
              <button className="btn btn-secondary btn-sm" style={{ padding: '8px' }} title="More Options">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages" style={{
            flex: 1, overflowY: 'auto', padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: '4px',
            background: 'var(--bg-primary)'
          }}>
            {getDateGroups().map((item, idx) => {
              if (item.type === 'date') {
                return (
                  <div key={`date-${idx}`} style={{
                    textAlign: 'center', margin: '16px 0',
                  }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 16px',
                      background: 'var(--table-header-bg)',
                      border: 'var(--border-width) solid var(--border-color)',
                      borderRadius: '20px', fontSize: '0.75rem',
                      fontWeight: 700, color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {item.label}
                    </span>
                  </div>
                );
              }

              const msg = item.data;
              const isSent = msg.senderId === 'u3';
              const isRead = msg.readBy?.includes('u2');

              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: isSent ? 'flex-end' : 'flex-start',
                  marginBottom: '4px',
                  animation: 'msgSlideIn 0.3s ease-out'
                }}>
                  {/* Avatar for received messages */}
                  {!isSent && (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--info)', border: 'var(--border-width) solid var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: '0.7rem',
                      flexShrink: 0, marginRight: '8px', marginTop: '4px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}

                  <div style={{ maxWidth: '70%' }}>
                    <div className={`chat-msg ${isSent ? 'sent' : 'received'}`} style={{
                      padding: '12px 16px',
                      borderRadius: isSent
                        ? 'var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)'
                        : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
                      lineHeight: '1.5',
                      position: 'relative'
                    }}>
                      <div style={{ wordBreak: 'break-word' }}>{msg.message}</div>
                      <div className="chat-msg-time" style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        justifyContent: 'flex-end', marginTop: '4px'
                      }}>
                        {formatTime(msg.timestamp)}
                        {isSent && (
                          isRead
                            ? <CheckCheck size={14} style={{ color: isSent ? 'rgba(255,255,255,0.8)' : 'var(--info)' }} />
                            : <Check size={14} style={{ opacity: 0.6 }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                animation: 'msgSlideIn 0.3s ease-out'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--info)', border: 'var(--border-width) solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '0.7rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{
                  padding: '12px 20px',
                  background: 'var(--table-header-bg)',
                  border: 'var(--border-width) solid var(--border-color)',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <div className="typing-dot" style={{ animationDelay: '0ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '200ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker */}
          {showEmoji && (
            <div ref={emojiRef} style={{
              padding: '12px 16px',
              borderTop: 'var(--border-width) solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex', flexWrap: 'wrap', gap: '4px',
              animation: 'msgSlideIn 0.2s ease-out'
            }}>
              {EMOJI_LIST.map(emoji => (
                <button key={emoji} onClick={() => addEmoji(emoji)} style={{
                  background: 'var(--bg-input)', border: 'var(--border-width) solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', padding: '6px 10px',
                  fontSize: '1.2rem', cursor: 'pointer',
                  transition: 'var(--transition)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Enhanced Input Area */}
          <div className="chat-input-area" style={{
            padding: '16px 24px', gap: '10px',
            borderTop: 'var(--border-width) solid var(--border-color)',
            background: 'var(--table-header-bg)',
            alignItems: 'center'
          }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px', flexShrink: 0 }}
              title="Attach file"
            >
              <Paperclip size={18} />
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px', flexShrink: 0 }}
              title="Send image"
            >
              <Image size={18} />
            </button>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                className={`btn btn-secondary btn-sm`}
                style={{
                  padding: '8px',
                  background: showEmoji ? 'var(--accent)' : undefined,
                  color: showEmoji ? '#fff' : undefined
                }}
                onClick={() => setShowEmoji(!showEmoji)}
                title="Emoji"
              >
                <Smile size={18} />
              </button>
            </div>
            <input
              ref={inputRef}
              placeholder="Type a message..."
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1, padding: '12px 16px', fontSize: '0.95rem',
                borderRadius: 'var(--radius-lg)'
              }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSend}
              disabled={!newMsg.trim()}
              style={{
                padding: '10px 20px', flexShrink: 0,
                opacity: !newMsg.trim() ? 0.5 : 1,
                cursor: !newMsg.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Send size={16} />
              <span style={{ fontWeight: 700 }}>Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes pulse-online {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes msgSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--text-muted);
          animation: typingBounce 1.4s infinite ease-in-out;
        }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
