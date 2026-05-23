import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gray-400 font-mono">
      <span className="dot dot-1 rounded-full bg-red-400 h-2.5 w-2.5" />
      <span className="dot dot-2 rounded-full bg-red-400 h-2.5 w-2.5" />
      <span className="dot dot-3 rounded-full bg-red-400 h-2.5 w-2.5" />
      <span className="ml-2">Thinking...</span>
    </div>
  );
};

export default TypingIndicator;
