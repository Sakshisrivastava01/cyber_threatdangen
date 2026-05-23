import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'SQLi', count: 4000, color: '#00E5FF' },
  { name: 'XSS', count: 3000, color: '#7B61FF' },
  { name: 'DDoS', count: 2000, color: '#00FFA3' },
  { name: 'Brute', count: 2780, color: '#00E5FF' },
  { name: 'Malware', count: 1890, color: '#7B61FF' },
  { name: 'Zero-day', count: 2390, color: '#00FFA3' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number }> | null;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-dangen-cyan/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
        <p className="text-white font-mono text-sm">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ThreatPulseChart: React.FC = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.5)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'monospace' }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThreatPulseChart;
