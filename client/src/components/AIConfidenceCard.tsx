import React from 'react';

interface AIConfidenceCardProps {
  title: string;
  value: string;
  status: 'Secure' | 'Alert';
}

const AIConfidenceCard: React.FC<AIConfidenceCardProps> = ({ title, value, status }) => {
  const isSecure = status === 'Secure';
  
  return (
    <div className={`glass-panel p-6 relative overflow-hidden ${isSecure ? 'border-dangen-green/30' : 'border-dangen-cyan/30'}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${isSecure ? 'from-dangen-green/20' : 'from-dangen-cyan/20'} to-transparent rounded-bl-full`}></div>
      <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4 relative z-10">{title}</h3>
      <div className="flex items-end gap-4 relative z-10">
        <p className="text-6xl font-mono font-bold neon-text">{value}</p>
        <div className="pb-2">
          <span className={`px-2 py-1 text-xs uppercase tracking-widest rounded border ${isSecure ? 'text-dangen-green border-dangen-green/50 bg-dangen-green/10' : 'text-dangen-cyan border-dangen-cyan/50 bg-dangen-cyan/10'}`}>
            {status}
          </span>
        </div>
      </div>
      
      {/* Animated pulse bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
        <div 
          className={`h-full ${isSecure ? 'bg-dangen-green' : 'bg-dangen-cyan'} transition-all duration-1000 ease-in-out`} 
          style={{ width: value }}
        ></div>
      </div>
    </div>
  );
};

export default AIConfidenceCard;
