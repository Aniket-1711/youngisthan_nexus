import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, ChevronDown, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getChatbotResponse } from '../lib/geminiClient';
import { useAuth } from '../context/AuthContext';

export default function GlobalAIChatbot() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Default system message for first open
  const defaultGreeting = "Hi! I'm your Nexus Platform Assistant. How can I help you today?";
  
  const [messages, setMessages] = useState([
    { role: 'assistant', text: defaultGreeting }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [learnToTeach, setLearnToTeach] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const isStudent = currentUser?.role === 'student';
  const isAdmin = currentUser?.role === 'ngo_admin';

  // Do not show global AI for students unless requested, but user requested "all over dashboard" explicitly for Mentor, let's show for all anyway.

  const handleSend = async () => {
    if (!inputVal.trim()) return;
    
    const userText = inputVal.trim();
    setInputVal('');
    
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    // Call API with generalized context ("General Dashboard")
    const responseText = await getChatbotResponse(userText, "General Dashboard", !isStudent && !isAdmin, learnToTeach);
    
    setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{
          position: 'fixed', // Fixed so it floods the whole viewport
          bottom: '24px', 
          right: '24px',
          zIndex: 9000,
          borderRadius: '50%', // Circle shape for the global icon
          width: '64px',
          height: '64px',
          padding: 0,
          boxShadow: '4px 4px 0 #000, 0 10px 15px -3px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bot size={32} />
      </button>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px', 
        right: '24px',
        width: '350px',
        height: '550px',
        maxHeight: 'calc(100vh - 48px)',
        background: 'var(--bg-card)',
        border: '3px solid #000',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '8px 8px 0 #000',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9000,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* HEADER */}
      <div style={{ 
        background: 'var(--accent)', 
        color: '#fff', 
        padding: '16px', 
        borderBottom: '2px solid #000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={24} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: '1' }}>Nexus Assistant</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Available Everywhere</div>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* MENTOR TOGGLE */}
      {(!isStudent && !isAdmin) && (
        <div style={{ 
          background: 'var(--table-header-bg)', 
          borderBottom: '1px solid var(--border-color)', 
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={14} /> Learn to Teach Mode
          </span>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={learnToTeach} 
              onChange={(e) => setLearnToTeach(e.target.checked)} 
              style={{ marginRight: '6px' }}
            />
            <span style={{ fontSize: '0.75rem' }}>{learnToTeach ? 'ON' : 'OFF'}</span>
          </label>
        </div>
      )}

      {/* CHAT BODY */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            gap: '8px'
          }}>
            {m.role === 'assistant' && (
              <div style={{ width: '28px', height: '28px', flexShrink: 0, borderRadius: '50%', background: 'var(--accent-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} />
              </div>
            )}
            
            <div style={{
              maxWidth: '80%',
              background: m.role === 'user' ? '#000' : '#fff',
              color: m.role === 'user' ? '#fff' : '#000',
              border: '2px solid #000',
              padding: '10px 14px',
              borderRadius: '12px',
              borderBottomRightRadius: m.role === 'user' ? '2px' : '12px',
              borderTopLeftRadius: m.role === 'assistant' ? '2px' : '12px',
              fontSize: '0.9rem',
              lineHeight: '1.4',
              boxShadow: m.role === 'assistant' ? '3px 3px 0 rgba(0,0,0,0.1)' : 'none'
            }}>
              {m.role === 'assistant' ? (
                <div className="markdown-body" style={{ fontSize: '0.9rem' }}>
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              ) : (
                m.text
              )}
            </div>
            
            {m.role === 'user' && (
              <div style={{ width: '28px', height: '28px', flexShrink: 0, borderRadius: '50%', background: 'var(--border-color)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', flexShrink: 0, borderRadius: '50%', background: 'var(--accent-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} />
            </div>
            <div style={{ padding: '10px 14px', background: '#fff', border: '2px solid #000', borderRadius: '12px', color: 'var(--text-muted)' }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div style={{ padding: '12px', borderTop: '2px solid #000', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={learnToTeach ? "Ask how to teach globally..." : "Ask the AI Assistant..."}
            style={{ 
              flex: 1, 
              padding: '10px 12px', 
              border: '2px solid var(--border-color)', 
              borderRadius: '8px',
              outline: 'none',
              background: 'var(--bg-primary)'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputVal.trim() || isTyping}
            style={{ 
              background: 'var(--info)', 
              color: '#fff', 
              border: '2px solid #000', 
              borderRadius: '8px', 
              padding: '0 16px',
              cursor: (!inputVal.trim() || isTyping) ? 'not-allowed' : 'pointer',
              opacity: (!inputVal.trim() || isTyping) ? 0.6 : 1
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
