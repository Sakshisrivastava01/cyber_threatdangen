import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSend, FiShield, FiZap, FiX } from 'react-icons/fi';
import SecurityOrb from './SecurityOrb';
import ResponseMessage from './ResponseMessage';
import TypingIndicator from './TypingIndicator';
import { fetchIntelligenceQuery } from '../services/api';

interface ChatEntry {
  role: 'core' | 'user' | 'system';
  text: string;
  time: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

const defaultMessages: ChatEntry[] = [
  {
    role: 'core',
    text: 'DANGEN Threat Intelligence Panel online. I can explain attacks, review alerts, and help validate IP reputation.',
    time: '00:00',
    severity: 'low',
  },
];

const suggestionQueries = [
  { label: 'Explain current threat posture', value: 'Explain the current threat posture and active alerts.' },
  { label: 'Summarize active alerts', value: 'Summarize the active alerts and their severity.' },
  { label: 'Check IP reputation', value: 'Analyze the reputation of the latest suspicious IP.' },
  { label: 'Use dashboard guidance', value: 'How do I interpret the threat map and live risk scores?' },
];

const ThreatAnalysisPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>(defaultMessages);
  const [draft, setDraft] = useState('Explain the current threat posture.');
  const [pendingText, setPendingText] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const history = useMemo(() => {
    const pairs: Array<{ user: string; analyst: string }> = [];
    let lastUser = '';

    messages.forEach((item) => {
      if (item.role === 'user') {
        lastUser = item.text;
      }

      if (item.role === 'core' && lastUser) {
        pairs.push({ user: lastUser, analyst: item.text });
        lastUser = '';
      }
    });

    return pairs.slice(-6);
  }, [messages]);

  const contextualSuggestions = useMemo(() => {
    const last = messages[messages.length - 1];
    if (last?.role === 'core' && last.text.includes('threat')) {
      return [
        suggestionQueries[1],
        suggestionQueries[2],
        suggestionQueries[3],
      ];
    }
    if (last?.role === 'user') {
      return [
        suggestionQueries[0],
        suggestionQueries[1],
      ];
    }
    return suggestionQueries;
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, streamingText]);

  useEffect(() => {
    if (!pendingText) return;
    let index = 0;
    setTimeout(() => setStreamingText(''), 0);
    const interval = window.setInterval(() => {
      if (index >= pendingText.length) {
        window.clearInterval(interval);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((current) => [
          ...current,
          { role: 'core', text: pendingText, time, severity: 'high' },
        ]);
        setPendingText('');
        setLoading(false);
        return;
      }
      setStreamingText((value) => value + pendingText[index]);
      index += 1;
    }, 18);

    return () => window.clearInterval(interval);
  }, [pendingText]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) {
      setError('Enter a query first.');
      return;
    }

    setError(null);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((current) => [...current, { role: 'user', text: messageText, time }]);
    setLoading(true);
    setPendingText('');
    setStreamingText('');

    try {
      const result = await fetchIntelligenceQuery(messageText, history);
      const coreText = result?.response || 'Intelligence retrieval failed. Please try again.';
      setPendingText(coreText);
    } catch (err) {
      const fallback = 'Unable to connect to the intelligence backend. Review network and try again.';
      setError(typeof err === 'string' ? err : fallback);
      setLoading(false);
    }
  };

  const handleQuickAction = async (value: string) => {
    setDraft(value);
    await sendMessage(value);
  };

  const panelClasses = open
    ? 'shadow-[0_0_40px_rgba(255,0,60,0.35)]'
    : 'shadow-[0_0_20px_rgba(0,0,0,0.25)]';

  return (
    <div className="intel-panel-container">
      <div className="intel-panel-particles pointer-events-none">
        <span className="intel-panel-particle h-3 w-3 left-4 top-6" />
        <span className="intel-panel-particle h-4 w-4 left-14 top-10" />
        <span className="intel-panel-particle h-2 w-2 right-14 top-4" />
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, scale: open ? 1 : 1 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`intel-panel glass-panel w-[360px] max-w-full pointer-events-auto overflow-hidden border-red-500/20 ${panelClasses}`}
            >
              <div className="relative overflow-hidden bg-[#09080e]/95 px-4 py-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.18),transparent_45%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#ff2c5a] via-[#ff5f95] to-[#ff1a3a] opacity-70 blur-xl" />
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-red-300 font-semibold font-mono">
                      <FiShield size={14} />
                      DANGEN Threat Intelligence Panel
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Secure analysis pipeline ready to assist.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-300 transition hover:bg-white/10"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>

              <div className="max-h-[440px] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 bg-[#08070c]/90">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-gray-500 font-mono">Live threat briefing</p>
                </div>
                <div className="max-h-[260px] overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
                  <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                      <ResponseMessage
                        key={`${message.role}-${index}-${message.time}`}
                        role={message.role}
                        text={message.text}
                        time={message.time}
                        severity={message.role === 'core' ? message.severity : undefined}
                      />
                    ))}
                    {loading && !streamingText ? (
                      <ResponseMessage
                        key="core-loading"
                        role="core"
                        text="Composing intelligent risk analysis..."
                        time="--:--"
                        severity="medium"
                      />
                    ) : null}
                    {pendingText ? (
                      <ResponseMessage
                        key="core-streaming"
                        role="core"
                        text={streamingText}
                        time="--:--"
                        severity="high"
                      />
                    ) : null}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-white/10 bg-[#0b0710]/90 px-4 py-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {contextualSuggestions.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleQuickAction(item.value)}
                        className="intel-chip rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/20"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="Ask the Threat Intelligence Panel a cyber question..."
                        className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/15"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => void sendMessage(draft)}
                      disabled={loading}
                      className="inline-flex h-12 items-center justify-center rounded-3xl bg-red-500 px-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiSend size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>{loading ? <TypingIndicator /> : 'Ready for secure analysis.'}</span>
                    <span className="inline-flex items-center gap-1 text-red-300">
                      <FiZap size={12} /> Secure Feed
                    </span>
                  </div>
                  {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SecurityOrb open={open} onClick={() => setOpen((value) => !value)} />
      </motion.div>
    </div>
  );
};

export default ThreatAnalysisPanel;
