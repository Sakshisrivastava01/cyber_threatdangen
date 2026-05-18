import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const INITIAL_FEEDS = [
  { id: 1, market: 'Genesis Market', item: 'Enterprise VPN Credentials (US)', price: '$450', risk: 'CRITICAL', time: '2m ago' },
  { id: 2, market: 'Exploit.in', item: 'Zero-Day RCE (Apache Struts)', price: '$12,000', risk: 'CRITICAL', time: '14m ago' },
  { id: 3, market: 'BreachForums', item: 'Fintech Customer DB (1.2M rows)', price: '$2,500', risk: 'HIGH', time: '31m ago' },
  { id: 4, market: 'Russian Market', item: 'RDP Access Botnet C2 (EU-CENTRAL)', price: '$85', risk: 'MEDIUM', time: '1h ago' },
  { id: 5, market: 'XSS.is', item: 'Compromised AWS IAM Keys', price: '$1,200', risk: 'HIGH', time: '2h ago' },
];

const DarknetSignals: React.FC = () => {
  const [feeds, setFeeds] = useState(INITIAL_FEEDS);

  useEffect(() => {
    const interval = setInterval(() => {
      const markets = ['Genesis Market', 'Exploit.in', 'BreachForums', 'Russian Market', 'XSS.is', '2Easy Forum'];
      const items = ['Corporate RDP Access', 'Stolen Session Cookies', 'Database Dump (Healthcare)', 'Phishing Kit Template', 'C2 Server Infrastructure'];
      const risks = ['MEDIUM', 'HIGH', 'CRITICAL'];
      const prices = ['$120', '$550', '$3,400', '$8,500', '$45'];

      const newFeed = {
        id: Date.now(),
        market: markets[Math.floor(Math.random()*markets.length)],
        item: items[Math.floor(Math.random()*items.length)],
        price: prices[Math.floor(Math.random()*prices.length)],
        risk: risks[Math.floor(Math.random()*risks.length)],
        time: 'Just now',
      };

      setFeeds(prev => [newFeed, ...prev.slice(0, 6)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 font-sans text-gray-300">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 font-mono">Darknet Signals</h1>
        <p className="text-sm text-gray-500 font-mono">Underground marketplace tracking & leaked credential indexing</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors pointer-events-none" />
          <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Active Breaches Indexed</h3>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-mono font-bold text-white">1,482</span>
            <span className="text-xs font-mono text-red-400">+34 today</span>
          </div>
        </div>
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors pointer-events-none" />
          <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Botnet C2 Servers Tracked</h3>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-mono font-bold text-purple-400">842</span>
            <span className="text-xs font-mono text-purple-300">Active</span>
          </div>
        </div>
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors pointer-events-none" />
          <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Dark Web Chatter Index</h3>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-mono font-bold text-cyan-400">94.2%</span>
            <span className="text-xs font-mono text-cyan-300">ELEVATED</span>
          </div>
        </div>
      </div>

      {/* Live Marketplace Feeds */}
      <div className="glass-panel p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
          <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Underground Marketplace Intercepts
          </h2>
          <span className="text-xs font-mono text-gray-500">TOR SCRAPER v4.0</span>
        </div>
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">MARKETPLACE</th>
                <th className="py-3 px-4">INTERCEPTED ASSET</th>
                <th className="py-3 px-4">ESTIMATED VALUE</th>
                <th className="py-3 px-4">RISK RATING</th>
                <th className="py-3 px-4">INDEXED TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {feeds.map((feed) => (
                <motion.tr
                  key={feed.id}
                  initial={{ opacity: 0, backgroundColor: 'rgba(255,46,99,0.2)' }}
                  animate={{ opacity: 1, backgroundColor: 'transparent' }}
                  transition={{ duration: 0.5 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 text-cyan-400 font-bold">{feed.market}</td>
                  <td className="py-4 px-4 text-gray-200">{feed.item}</td>
                  <td className="py-4 px-4 text-green-400">{feed.price}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] ${
                      feed.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_8px_rgba(255,46,99,0.3)]' :
                      feed.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {feed.risk}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{feed.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DarknetSignals;
