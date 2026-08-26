import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, Sparkles, Trash2, HelpCircle, Code } from 'lucide-react';

const TerminalWidget = ({ profile, skills = [], projects = [], contactInfo, experiences = [], education = [] }) => {
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
          '  about      - Display developer summary & current profile',
          '  skills     - Technical capabilities & model stack',
          '  projects   - Production AI & engineering builds',
          '  contact    - Retrieve direct contact details & links',
          '  clear      - Clear terminal output screen'
        ];
        break;
      case 'about':
        responseText = [
          `👤 ${profile?.name || 'Kuldeep Tapodhan'} | ${profile?.title || 'Python AI & ML Developer'}`,
          experiences[0]?.company_name ? `📍 Company: ${experiences[0].company_name} (${experiences[0].role})` : null,
          education[0]?.degree ? `🎓 Education: ${education[0].degree} @ ${education[0].institution}` : null,
          profile?.bio ? `💡 Summary: ${profile.bio}` : null
        ].filter(Boolean);
        break;
      case 'skills':
        responseText = skills.length > 0 ? [
          '🛠️ Technical Capabilities:',
          ...skills.slice(0, 12).map((s) => `  • ${s.name} (${s.percentage}%)`)
        ] : [
          '🛠️ Technical Capabilities: AI/ML, LLM Fine-Tuning, Multi-Agent Systems, FastAPI, Django, PyTorch.'
        ];
        break;
      case 'projects':
        responseText = projects.length > 0 ? [
          '🚀 Flagship AI Projects:',
          ...projects.map((p, idx) => `  ${idx + 1}. ${p.title} ${p.tech_stack ? `[${p.tech_stack}]` : ''}`)
        ] : [
          '🚀 Flagship AI Projects: Multi-Agent Voice Bot, Healthcare RAG Engine, Computer Vision Mobile App.'
        ];
        break;
      case 'contact':
        const email = contactInfo?.email || profile?.email;
        const phone = contactInfo?.phone || profile?.phone;
        const github = contactInfo?.github_link || profile?.github_link;
        const linkedin = contactInfo?.linkedin_link || profile?.linkedin_link;
        responseText = [
          '📬 Direct Channels:',
          email ? `  • Email: ${email}` : null,
          phone ? `  • Phone: ${phone}` : null,
          github ? `  • GitHub: ${github}` : null,
          linkedin ? `  • LinkedIn: ${linkedin}` : null
        ].filter(Boolean);
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

  const terminalBodyRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
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
      <div className="terminal-body" ref={terminalBodyRef}>
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
