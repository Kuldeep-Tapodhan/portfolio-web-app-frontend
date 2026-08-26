import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, Sparkles, Trash2, HelpCircle, Code } from 'lucide-react';

const TerminalWidget = () => {
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: '🤖 Kuldeep AI Neural CLI v2.4 initialized [zsh/x86_64].'
    },
    {
      type: 'system',
      text: 'Type "help" or click one of the quick command pills below to interact.'
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
          '  about      - Display developer summary & current focus',
          '  voice-bot  - LiveKit Multi-Agent Voice AI Architecture',
          '  rag        - BioMistral-7B Regional Healthcare RAG Chatbot',
          '  skills     - AI/ML, LLM Fine-Tuning, Backend & DevOps stack',
          '  projects   - Production AI systems showcase',
          '  contact    - Retrieve direct contact details & links',
          '  clear      - Clear terminal output screen'
        ];
        break;
      case 'about':
        responseText = [
          '👤 Kuldeep Tapodhan | Python AI & ML Developer',
          '📍 Company: Amenity Technologies (1+ Years Industry Experience)',
          '🎓 Degree: B.Tech in Information Technology',
          '💡 Expertise: Multi-Agent Systems, RAG Pipelines, Computer Vision, Fast-API / Django REST Framework.'
        ];
        break;
      case 'voice-bot':
        responseText = [
          '🎙️ Multi-Agent Voice AI Platform:',
          '  • Stack: LiveKit Agents SDK + Deepgram Nova 3 (STT) + Cartesia Sonic (TTS)',
          '  • Core Feature: Zero-latency domain handoffs across specialized agents',
          '  • LLM Backbones: Gemini 2.5 Flash, Claude 3.5 Sonnet, GPT-4o',
          '  • Transport: WebRTC real-time audio + SIP/VOIP telemetry bridge'
        ];
        break;
      case 'rag':
        responseText = [
          '🏥 Regional Health Assistance Chatbot (RAG):',
          '  • Model: BioMistral-7B fine-tuned via QLoRA (MedQuAD & HealthcareMagic datasets)',
          '  • Vector Store: ChromaDB with 384d Sentence Transformers',
          '  • Capabilities: 127+ clinical PDF parsing, Tesseract OCR OCR, Haversine GPS hospital locator'
        ];
        break;
      case 'skills':
        responseText = [
          '🛠️ Technical Capabilities:',
          '  • AI & ML: PyTorch, TensorFlow, OpenCV, Scikit-Learn, LangChain, ChromaDB, RAG',
          '  • LLMs & Voice: Llama 3.3, BioMistral, LiveKit, Silero VAD, Deepgram, Cartesia',
          '  • Backend: FastAPI, Django / DRF, Flask, REST APIs, PostgreSQL, MySQL',
          '  • Cloud & DevOps: Docker, Nginx, SSL, DNS, AWS EC2/S3, GitHub Actions'
        ];
        break;
      case 'projects':
        responseText = [
          '🚀 Flagship AI Projects:',
          '  1. Multi-Agent Voice Bot Platform (LiveKit + DRF + WebRTC/SIP)',
          '  2. Regional Health Assistance Chatbot (BioMistral RAG + FastAPI)',
          '  3. Plantify - Disease Detection Mobile System (TFLite + Kotlin)',
          '  4. Bollywood Song Recommendation Engine (KNN + Flask)',
          '  5. Disease Prediction & Drug Recommender (Random Forest + Gemini LLM)',
          '  6. Production Dynamic Task Management System (Django DRF + PostgreSQL)'
        ];
        break;
      case 'contact':
        responseText = [
          '📬 Direct Channels:',
          '  • Email: kuldeep.tapodhan0306@gmail.com',
          '  • GitHub: https://github.com/Kuldeep-Tapodhan',
          '  • LinkedIn: https://www.linkedin.com/in/kuldeep-tapodhan-780701251/',
          '  • Phone: +91 9016568931'
        ];
        break;
      default:
        responseText = [
          `⚠️ Command not recognized: "${trimmed}". Type "help" or click a pill shortcut.`
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
          <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
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
        <button type="submit" className="terminal-submit-btn" title="Execute command">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default TerminalWidget;
