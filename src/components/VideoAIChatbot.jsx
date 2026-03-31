import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, ChevronDown, GraduationCap, Sparkles, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getChatbotResponse } from '../lib/geminiClient';
import { useVideo } from '../context/VideoContext';
import { createPortal } from 'react-dom';

export default function VideoAIChatbot() {
  const { currentVideo, isStudent, isWatching, isFullscreen, fullscreenContainerRef } = useVideo();
  const videoTitle = currentVideo?.title || '';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! I'm your **Nexus AI Tutor** ✨. Start watching a video and ask me anything about it!` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [learnToTeach, setLearnToTeach] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // When the active video changes, reset chat context
  useEffect(() => {
    if (videoTitle) {
      setMessages([
        { role: 'assistant', text: `Hey there! 👋 You're now watching **${videoTitle}**. Ask me anything — I'll keep it short and story-like!` }
      ]);
    }
  }, [videoTitle]);

  const handleSend = async () => {
    if (!inputVal.trim() || isTyping) return;
    
    const userText = inputVal.trim();
    setInputVal('');
    
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const responseText = await getChatbotResponse(userText, videoTitle, !isStudent, learnToTeach);
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      console.error('Chatbot UI send error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error: Request failed in the UI layer. Please retry.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Build the chatbot JSX
  const chatbotContent = (
    <>
      {/* FLOATING ACTION BUTTON (when closed) */}
      {!isOpen && (
        <button
          id="ai-chatbot-fab"
          onClick={() => setIsOpen(true)}
          className="ai-chatbot-fab"
          style={{
            position: isFullscreen ? 'absolute' : 'fixed',
            bottom: isFullscreen ? 'auto' : '28px',
            top: isFullscreen ? '24px' : 'auto',
            right: '28px',
            zIndex: 9999,
          }}
        >
          <div className="ai-chatbot-fab-icon">
            <Sparkles size={22} />
          </div>
          <span className="ai-chatbot-fab-label">AI Tutor</span>
          <div className="ai-chatbot-fab-pulse" />
        </button>
      )}

      {/* CHAT PANEL (when open) */}
      {isOpen && (
        <div
          id="ai-chatbot-panel"
          className="ai-chatbot-panel"
          style={{
            position: isFullscreen ? 'absolute' : 'fixed',
            bottom: isFullscreen ? 'auto' : '28px',
            top: isFullscreen ? '24px' : 'auto',
            right: '28px',
            zIndex: 9999,
          }}
        >
          {/* HEADER */}
          <div className="ai-chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ai-chatbot-header-avatar">
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: '1.1' }}>Nexus AI</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: '2px' }}>
                  {videoTitle ? `📹 ${videoTitle.length > 22 ? videoTitle.substring(0, 22) + '…' : videoTitle}` : 'Ready to help'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ai-chatbot-close"
              title="Minimize"
            >
              <ChevronDown size={22} />
            </button>
          </div>

          {/* MENTOR TOGGLE */}
          {!isStudent && (
            <div className="ai-chatbot-mentor-toggle">
              <span style={{ fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={14} /> Learn to Teach
              </span>
              <label className="ai-chatbot-switch">
                <input
                  type="checkbox"
                  checked={learnToTeach}
                  onChange={(e) => setLearnToTeach(e.target.checked)}
                />
                <span className="ai-chatbot-switch-slider" />
              </label>
            </div>
          )}

          {/* CHAT BODY */}
          <div className="ai-chatbot-body">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`ai-chatbot-msg ${m.role}`}
                style={{
                  animationDelay: `${i * 0.05}s`
                }}
              >
                {m.role === 'assistant' && (
                  <div className="ai-chatbot-msg-avatar assistant">
                    <Bot size={14} />
                  </div>
                )}
                
                <div className={`ai-chatbot-msg-bubble ${m.role}`}>
                  {m.role === 'assistant' ? (
                    <div className="ai-chatbot-markdown">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  ) : (
                    m.text
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="ai-chatbot-msg-avatar user">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="ai-chatbot-msg assistant">
                <div className="ai-chatbot-msg-avatar assistant">
                  <Bot size={14} />
                </div>
                <div className="ai-chatbot-msg-bubble assistant">
                  <div className="ai-chatbot-typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="ai-chatbot-input-area">
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={learnToTeach ? 'Ask how to teach this…' : 'Ask the AI Tutor…'}
              className="ai-chatbot-input"
            />
            <button
              onClick={handleSend}
              disabled={!inputVal.trim() || isTyping}
              className="ai-chatbot-send-btn"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );

  // In fullscreen mode, portal the chatbot into the fullscreen container
  if (isFullscreen && fullscreenContainerRef) {
    return createPortal(chatbotContent, fullscreenContainerRef);
  }

  // Normal mode: render in place (which is at layout level = fixed to viewport)
  return chatbotContent;
}
