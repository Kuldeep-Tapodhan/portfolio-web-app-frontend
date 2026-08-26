import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, Send, Sparkles } from 'lucide-react';

const TerminalWidget = () => {
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: '🤖 Kuldeep AI Agent Terminal v2.4 initialized.'
    },
    {
      type: 'system',
      text: 'Type "help" or click one of the quick command pills below to explore.'
    }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const commandShortcuts = [
    'help',
    'about',
    'voice-bot',
    'rag',
    'skills',
    'projects',
    'contact',
    'clear'
  ];

  const handleCommand = (cmdStr) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    const newHistory = [...history, { type: 'user', text: `$ ${cmdStr}` }];

    let responseText = [];
    switch (trimmed) {
      case 'help':
        responseText = [
          '⚡ Available Commands:',
          '  about      - Display developer summary & background',
          '  voice-bot  - Details on Multi-Agent LiveKit Voice Bot Architecture',
          '  rag        - Details on BioMistral-7B RAG Healthcare Chatbot',
          '  skills     - List AI/ML, Backend & DevOps skill stack',
          '  projects   - Show list of production AI projects',
          '  contact    - Retrieve contact information & links',
          '  clear      - Clear the terminal screen'
        ];
        break;
      case 'about':
        responseText = [
          '👤 Kuldeep Tapodhan | Python AI/ML Developer',
          '📍 Company: Amenity Technologies (1+ Years Exp)',
          '🎓 Qualification: B.Tech in Information Technology',
          '💡 Specialization: Multi-Agent Systems, RAG Pipelines, Computer Vision, FastAPI/Django Backends.'
        ];
        break;
      case 'voice-bot':
        responseText = [
          '🎙️ Multi-Agent Voice AI Platform:',
          '  • SDK: LiveKit Agents SDK + Deepgram Nova 3 (STT) + Cartesia Sonic (TTS)',
          '  • Architecture: Plug & Play domain orchestration with zero dead-air handoffs',
          '  • Models: Gemini 2.5 Flash, Claude 3.5, OpenAI GPT-4o',
          '  • Transport: WebRTC & SIP/VOIP integration with VPS Docker deployment'
        ];
        break;
      case 'rag':
        responseText = [
          '🏥 Regional Health Assistance Chatbot (RAG):',
          '  • LLM: BioMistral-7B fine-tuned on Lightning AI (MedQuAD, HealthcareMagic)',
          '  • Vector DB: ChromaDB with 384-dimensional Sentence Transformers',
          '  • Features: 127+ medical docs, Tesseract OCR report parsing, Haversine Hospital finder'
        ];
        break;
      case 'skills':
        responseText = [
          '🛠️ Tech Stack Overview:',
          '  • AI/ML: PyTorch, TensorFlow, OpenCV, Scikit-Learn, LangChain, ChromaDB, RAG',
          '  • LLMs & Voice: Llama 3.3, BioMistral, LiveKit, Silero VAD, Deepgram, Cartesia',
          '  • Backend: FastAPI, Django / DRF, Flask, REST APIs, PostgreSQL, MySQL',
          '  • DevOps: Docker, Nginx, SSL, DNS, AWS (S3, EC2), GitHub Actions (CI/CD)'
        ];
        break;
      case 'projects':
        responseText = [
          '🚀 Highlight Projects:',
          '  1. Multi-Agent Voice Bot (LiveKit + Django + WebRTC/SIP)',
          '  2. Regional Health Assistance Chatbot (BioMistral RAG + FastAPI)',
          '  3. Plantify - Disease Detection System & Mobile App (TFLite + Kotlin)',
          '  4. Bollywood Song Recommendation System (KNN + Flask)',
          '  5. Disease Prediction & Drug Recommendation (Random Forest + Gemini)',
          '  6. Dynamic Task Management System (Django DRF + PostgreSQL)',
          '  7. College Fest Event Management (Java JSP + JDBC + MySQL)'
        ];
        break;
      case 'contact':
        responseText = [
          '📬 Reach Out:',
          '  • Email: kuldeep.tapodhan0306@gmail.com',
          '  • GitHub: https://github.com/Kuldeep-Tapodhan',
          '  • LinkedIn: https://www.linkedin.com/in/kuldeep-tapodhan-780701251/',
          '  • Phone: +91 9016568931'
        ];
        break;
      default:
        responseText = [
          `⚠️ Command not recognized: "${trimmed}". Type "help" for a list of available commands.`
        ];
        break;
    }

    newHistory.push({ type: 'output', lines: responseText });
    setHistory(newHistory);
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="terminal-widget-container">
      {/* Top Mac-style Titlebar */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">
          <TerminalIcon size={14} className="terminal-title-icon" />
          <span>kuldeep@neural-node:~ (zsh)</span>
        </div>
        <div className="terminal-status">
          <span className="status-indicator"></span>
          <span>ONLINE</span>
        </div>
      </div>

      {/* Quick Command Pills */}
      <div className="terminal-shortcuts">
        <span className="shortcuts-label">Quick Commands:</span>
        {commandShortcuts.map((cmd) => (
          <button
            key={cmd}
            className="shortcut-btn"
            onClick={() => handleCommand(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Screen Body */}
      <div className="terminal-body">
        {history.map((item, idx) => (
          <div key={idx} className={`terminal-line ${item.type}`}>
            {item.type === 'user' && <span className="prompt-text">{item.text}</span>}
            {item.type === 'system' && <span className="system-text">{item.text}</span>}
            {item.type === 'output' && (
              <div className="output-lines">
                {item.lines.map((line, lIdx) => (
                  <div key={lIdx} className="output-line">{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt Footer */}
      <form
        className="terminal-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(input);
        }}
      >
        <span className="input-prompt">&gt;</span>
        <input
          type="text"
          className="terminal-input"
          placeholder="Type 'help' or command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="terminal-submit-btn" title="Run command">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default TerminalWidget;
