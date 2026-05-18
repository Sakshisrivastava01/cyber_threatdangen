import React from 'react';

const TopAttacks: React.FC = () => {
  const attacks = [
    { type: 'Botnet Sweep', count: 8432, percentage: 45 },
    { type: 'Brute Force SSH', count: 4210, percentage: 22 },
    { type: 'SQLi Probes', count: 2845, percentage: 15 },
    { type: 'XSS Attempts', count: 1800, percentage: 10 },
    { type: 'Zero-day Pattern', count: 950, percentage: 5 },
  ];

  return (
    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
      {attacks.map((attack, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-xs text-gray-300">
            <span>{attack.type}</span>
            <span className="font-mono text-dangen-cyan">{attack.count.toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-dangen-purple to-dangen-cyan" 
              style={{ width: `${attack.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopAttacks;
