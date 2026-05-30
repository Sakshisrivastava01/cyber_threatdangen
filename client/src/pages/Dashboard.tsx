import React, { useEffect, useState, useMemo } from 'react';

const Dashboard: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const user = useMemo(
        () =>
          window.localStorage.getItem('dangen_user') ||
          window.sessionStorage.getItem('dangen_user') ||
          'operator@dangen.io',
        []
    );

    useEffect(() => {
        const timeInterval = window.setInterval(() => setCurrentTime(new Date()), 1000);
        return () => window.clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => {
            const nodes = document.querySelectorAll('.map-node');
            nodes.forEach(node => {
                if(Math.random() > 0.7) {
                    node.classList.add('primary-glow');
                    setTimeout(() => node.classList.remove('primary-glow'), 500);
                }
            });
        }, 2000);
        return () => window.clearInterval(interval);
    }, []);



    return (
        <div className="stitch-dashboard bg-background text-on-surface font-body-md overflow-x-hidden relative min-h-screen dark">
            <div className="stitch-scanline"></div>
            
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 stitch-glass-panel border-r border-primary/15 flex flex-col py-panel-padding z-40">
                <div className="px-6 mb-12">
                    <h1 className="font-headline-lg text-headline-lg text-primary tracking-tighter leading-tight">DANGEN</h1>
                    <p className="font-label-caps text-[10px] text-primary/60 tracking-[0.3em] mt-1 uppercase">Cyber Threat Defense</p>
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-1">
                        <li className="flex items-center gap-stack-md bg-primary-container/20 text-primary border-l-4 border-primary px-6 py-3 shadow-[inset_10px_0_15px_-10px_rgba(255,85,64,0.4)] cursor-pointer">
                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
                            <span className="font-label-caps text-label-caps">Command Center</span>
                        </li>
                        <li className="flex items-center gap-stack-md text-on-surface-variant px-6 py-3 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer">
                            <span className="material-symbols-outlined">hub</span>
                            <span className="font-label-caps text-label-caps">Neural Map</span>
                        </li>
                        <li className="flex items-center gap-stack-md text-on-surface-variant px-6 py-3 hover:text-primary transition-all cursor-pointer">
                            <span className="material-symbols-outlined">smart_toy</span>
                            <span className="font-label-caps text-label-caps">Threat Intelligence</span>
                        </li>
                        <li className="flex items-center gap-stack-md text-on-surface-variant px-6 py-3 hover:text-primary transition-all cursor-pointer">
                            <span className="material-symbols-outlined">security</span>
                            <span className="font-label-caps text-label-caps">Threat Intel</span>
                        </li>
                        <li className="flex items-center gap-stack-md text-on-surface-variant px-6 py-3 hover:text-primary transition-all cursor-pointer">
                            <span className="material-symbols-outlined">memory</span>
                            <span className="font-label-caps text-label-caps">ML Engine</span>
                        </li>
                        <li className="flex items-center gap-stack-md text-on-surface-variant px-6 py-3 hover:text-primary transition-all cursor-pointer">
                            <span className="material-symbols-outlined">description</span>
                            <span className="font-label-caps text-label-caps">RAG Docs</span>
                        </li>
                        <li className="flex items-center gap-stack-md text-on-surface-variant px-6 py-3 hover:text-primary transition-all cursor-pointer">
                            <span className="material-symbols-outlined">terminal</span>
                            <span className="font-label-caps text-label-caps">Device Intel</span>
                        </li>
                        <li className="flex items-center gap-stack-md text-on-surface-variant px-6 py-3 hover:text-primary transition-all cursor-pointer">
                            <span className="material-symbols-outlined">public</span>
                            <span className="font-label-caps text-label-caps">GeoPulse</span>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto px-6 space-y-4">
                    <div className="flex items-center gap-stack-md text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="font-label-caps text-label-caps">Settings</span>
                    </div>
                    <div className="pt-6 border-t border-primary/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-primary/30 p-0.5">
                            <img alt="Threat Analyst Avatar" className="w-full h-full rounded-full" src="/assets/analyst-avatar.png" />
                        </div>
                        <div>
                            <p className="font-label-caps text-[10px] text-white">{user}</p>
                            <p className="text-[9px] text-primary/50">Level 7</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-margin-page max-w-[1600px]">
                {/* Top Bar */}
                <header className="flex justify-between items-center mb-8">
                    <div className="relative w-96">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">search</span>
                        <input className="w-full bg-surface-container-lowest/50 border border-primary/20 rounded-lg py-2 pl-10 pr-4 text-body-md focus:ring-1 focus:ring-primary focus:border-primary placeholder-on-surface-variant/30 transition-all outline-none" placeholder="Search threats, IPs, domains, insights..." type="text" />
                    </div>
                    <div className="flex items-center gap-stack-lg">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="font-label-caps text-label-caps text-primary tracking-widest">LIVE</span>
                            <span className="font-data-point text-sm text-on-surface-variant ml-2">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">notifications</span>
                                <span className="absolute -top-1 -right-1 bg-primary text-black text-[9px] font-bold px-1 rounded-full">7</span>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">account_circle</span>
                        </div>
                    </div>
                </header>

                {/* Metric Grid */}
                <div className="grid grid-cols-5 gap-gutter mb-gutter">
                    <div className="stitch-glass-panel p-panel-padding relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-primary scale-150">trending_up</span>
                        </div>
                        <p className="font-label-caps text-[10px] text-on-surface-variant mb-2 uppercase tracking-tighter">Total Threats</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <h3 className="font-headline-lg text-3xl text-white">2,451</h3>
                                <p className="text-tertiary text-[10px] flex items-center mt-1">
                                    <span className="material-symbols-outlined text-xs mr-1">arrow_upward</span> 12.4%
                                </p>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center border border-primary/20 rounded-full primary-glow">
                                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>vital_signs</span>
                            </div>
                        </div>
                    </div>

                    <div className="stitch-glass-panel p-panel-padding relative overflow-hidden group">
                        <p className="font-label-caps text-[10px] text-on-surface-variant mb-2 uppercase tracking-tighter">Active Attacks</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <h3 className="font-headline-lg text-3xl text-white">123</h3>
                                <p className="text-tertiary text-[10px] flex items-center mt-1">
                                    <span className="material-symbols-outlined text-xs mr-1">arrow_upward</span> 5.7%
                                </p>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center border border-primary/20 rounded-full">
                                <span className="material-symbols-outlined text-primary animate-pulse">track_changes</span>
                            </div>
                        </div>
                    </div>

                    <div className="stitch-glass-panel p-panel-padding relative overflow-hidden group">
                        <p className="font-label-caps text-[10px] text-on-surface-variant mb-2 uppercase tracking-tighter">Compromised IPs</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <h3 className="font-headline-lg text-3xl text-white">89</h3>
                                <p className="text-tertiary text-[10px] flex items-center mt-1">
                                    <span className="material-symbols-outlined text-xs mr-1">arrow_upward</span> 3.2%
                                </p>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center border border-primary/20 rounded-full">
                                <span className="material-symbols-outlined text-primary">wifi_off</span>
                            </div>
                        </div>
                    </div>

                    <div className="stitch-glass-panel p-panel-padding relative overflow-hidden group">
                        <p className="font-label-caps text-[10px] text-on-surface-variant mb-2 uppercase tracking-tighter">Data Breaches</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <h3 className="font-headline-lg text-3xl text-white">23</h3>
                                <p className="text-tertiary text-[10px] flex items-center mt-1">
                                    <span className="material-symbols-outlined text-xs mr-1">arrow_upward</span> 11.9%
                                </p>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center border border-primary/20 rounded-full">
                                <span className="material-symbols-outlined text-primary">lock_open</span>
                            </div>
                        </div>
                    </div>

                    <div className="stitch-glass-panel p-panel-padding relative overflow-hidden group">
                        <p className="font-label-caps text-[10px] text-on-surface-variant mb-2 uppercase tracking-tighter">System Health</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <h3 className="font-headline-lg text-3xl text-white">98.6%</h3>
                                <p className="text-tertiary text-[10px] flex items-center mt-1">
                                    <span className="material-symbols-outlined text-xs mr-1">arrow_upward</span> 0.8%
                                </p>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center border border-tertiary/20 rounded-full bg-tertiary/5 shadow-[0_0_15px_rgba(0,230,57,0.15)]">
                                <span className="material-symbols-outlined text-tertiary">verified_user</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Map and Feed */}
                <div className="grid grid-cols-12 gap-gutter mb-gutter h-[450px]">
                    <div className="col-span-8 stitch-glass-panel p-panel-padding relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <h2 className="font-headline-lg text-xl tracking-tight text-white uppercase">Global Threat Map</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-primary tracking-widest">LIVE FEED</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                            <img className="w-full h-full object-cover grayscale invert" alt="A stylized global world map in high-contrast dark tones, featuring glowing red neon connection lines and pulsating data nodes indicating cyber attack routes. The aesthetic is ultra-modern HUD style with surgical precision, technical grid lines, and atmospheric depth, illuminated by soft red glows against a deep black background." src="/assets/global-map-glow.png" />
                            <div className="map-node top-[40%] left-[25%]"></div>
                            <div className="map-node top-[30%] left-[70%]"></div>
                            <div className="map-node top-[60%] left-[45%]"></div>
                            <div className="map-node top-[55%] left-[80%]"></div>
                        </div>
                        <div className="absolute bottom-6 left-6 stitch-glass-panel p-4 border-l-4 border-primary">
                            <p className="text-[10px] text-on-surface-variant font-bold mb-3">TOP ATTACK SOURCES</p>
                            <ul className="space-y-2 text-[11px] w-48">
                                <li className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-[12px] text-primary">flag</span> Russia</span> <span className="font-bold">2,320</span></li>
                                <li className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-[12px] text-primary">flag</span> United States</span> <span className="font-bold">1,876</span></li>
                                <li className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="material-symbols-outlined text-[12px] text-primary">flag</span> China</span> <span className="font-bold">1,234</span></li>
                            </ul>
                            <button className="mt-4 text-[10px] text-primary hover:underline font-bold uppercase tracking-widest w-full text-center">View All</button>
                        </div>
                        <div className="absolute bottom-6 right-6 flex items-center gap-3">
                            <span className="text-[9px] text-on-surface-variant">Low</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-tertiary rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-[9px] text-primary font-bold">Critical</span>
                        </div>
                    </div>

                    <div className="col-span-4 flex flex-col gap-4">
                        <div className="stitch-glass-panel p-panel-padding flex-grow flex flex-col h-full overflow-hidden">
                            <h2 className="font-headline-lg text-lg text-white mb-4 uppercase tracking-tight">Live Threat Feed</h2>
                            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                                <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                                        <div>
                                            <p className="text-[11px] font-bold text-white uppercase">Brute Force Attack</p>
                                            <p className="text-[10px] text-on-surface-variant">10.0.0.45</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant">2s ago</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                        <div>
                                            <p className="text-[11px] font-bold text-white uppercase">Malware Detected</p>
                                            <p className="text-[10px] text-on-surface-variant">185.220.101.4</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant">5s ago</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                        <div>
                                            <p className="text-[11px] font-bold text-white uppercase">DDoS Attack</p>
                                            <p className="text-[10px] text-on-surface-variant">103.21.244.0</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant">8s ago</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                                        <div>
                                            <p className="text-[11px] font-bold text-white uppercase">Suspicious Login</p>
                                            <p className="text-[10px] text-on-surface-variant">172.16.254.1</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant">12s ago</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                                        <div>
                                            <p className="text-[11px] font-bold text-white uppercase">Data Exfiltration</p>
                                            <p className="text-[10px] text-on-surface-variant">192.168.1.88</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant">15s ago</span>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 bg-surface-container/50 border border-primary/10 text-[10px] text-white hover:bg-primary/10 transition-all uppercase tracking-widest font-bold cursor-pointer">View All Activity</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-12 gap-gutter mb-gutter">
                    <div className="col-span-4 stitch-glass-panel p-panel-padding h-64 flex flex-col">
                        <h2 className="font-headline-lg text-sm text-white mb-6 uppercase tracking-tight">Threat Severity</h2>
                        <div className="flex-grow flex items-center justify-center gap-8">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" fill="none" r="50" stroke="rgba(255, 85, 64, 0.1)" strokeWidth="8"></circle>
                                    <circle className="drop-shadow-[0_0_8px_#ff5540]" cx="64" cy="64" fill="none" r="50" stroke="#ff5540" strokeDasharray="314" strokeDashoffset="150" strokeWidth="12"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-bold text-white">2,451</span>
                                    <span className="text-[8px] text-on-surface-variant uppercase">Total</span>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-[10px]"><span className="w-2 h-2 bg-primary rounded-full"></span> <span className="text-on-surface-variant w-12">Critical</span> <span className="font-bold text-white">23%</span></li>
                                <li className="flex items-center gap-2 text-[10px]"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> <span className="text-on-surface-variant w-12">High</span> <span className="font-bold text-white">32%</span></li>
                                <li className="flex items-center gap-2 text-[10px]"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> <span className="text-on-surface-variant w-12">Medium</span> <span className="font-bold text-white">28%</span></li>
                                <li className="flex items-center gap-2 text-[10px]"><span className="w-2 h-2 bg-tertiary rounded-full"></span> <span className="text-on-surface-variant w-12">Low</span> <span className="font-bold text-white">17%</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-span-4 stitch-glass-panel p-panel-padding h-64 flex flex-col">
                        <h2 className="font-headline-lg text-sm text-white mb-6 uppercase tracking-tight">Attack Types</h2>
                        <div className="flex-grow space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-on-surface-variant"><span>Malware</span> <span>37%</span></div>
                                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: '37%' }}></div></div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-on-surface-variant"><span>Phishing</span> <span>24%</span></div>
                                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden"><div className="h-full bg-primary/70" style={{ width: '24%' }}></div></div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-on-surface-variant"><span>DDoS</span> <span>19%</span></div>
                                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden"><div className="h-full bg-primary/50" style={{ width: '19%' }}></div></div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-on-surface-variant"><span>Brute Force</span> <span>12%</span></div>
                                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden"><div className="h-full bg-primary/30" style={{ width: '12%' }}></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-4 stitch-glass-panel p-panel-padding h-64 flex flex-col items-center justify-center relative">
                        <div className="absolute top-4 left-4 font-headline-lg text-sm text-white uppercase">System Status</div>
                        <div className="absolute top-4 right-4">
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer text-sm">close</span>
                        </div>
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" fill="none" r="65" stroke="rgba(0, 230, 57, 0.05)" strokeWidth="1"></circle>
                                <circle cx="80" cy="80" fill="none" r="55" stroke="rgba(0, 230, 57, 0.2)" strokeDasharray="345" strokeDashoffset="0" strokeWidth="4"></circle>
                                <circle className="drop-shadow-[0_0_12px_#00e639]" cx="80" cy="80" fill="none" r="55" stroke="#00e639" strokeDasharray="345" strokeDashoffset="40" strokeWidth="6"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <h4 className="text-3xl font-bold text-white leading-none">98.6%</h4>
                                <p className="text-[9px] text-tertiary font-bold tracking-[0.2em] uppercase mt-2">Secure</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-6">
                            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant"><span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span> Network</div>
                            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant"><span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span> Database</div>
                            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant"><span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span> API Gateway</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="ml-64 w-[calc(100%-16rem)] px-margin-page py-base flex justify-between items-center opacity-50 border-t border-primary/10">
                <p className="font-body-md text-body-md text-on-surface-variant">© 2026 DANGEN Cyber Threat Defense System</p>
                <div className="flex gap-stack-lg">
                    <span className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
                    <span className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
                    <span className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Security Disclosure</span>
                </div>
            </footer>

            {/* Neural Intelligence Assistant */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
                {/* Chat Popup */}
                <div className={`w-80 stitch-glass-panel border-primary/30 p-panel-padding shadow-[0_0_40px_rgba(255,85,64,0.1)] rounded-xl transition-all duration-500 ${isChatOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center p-2 primary-glow">
                                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                            </div>
                            <div>
                                <h5 className="text-[12px] font-bold text-white uppercase leading-tight">Neural Intelligence</h5>
                                <p className="text-[10px] text-tertiary flex items-center gap-1"><span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span> Online</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer text-sm">remove</span>
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer text-sm" onClick={() => setIsChatOpen(false)}>close</span>
                        </div>
                    </div>
                    <div className="space-y-4 mb-6 h-48 overflow-y-auto pr-2">
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[14px] text-primary">smart_toy</span>
                            </div>
                            <div className="bg-surface-variant/40 p-3 rounded-lg text-[11px] text-on-surface leading-relaxed">
                                Hi! I'm your Neural Intelligence console. How can I help you today?
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 mb-6">
                        <button className="w-full text-left p-2 rounded border border-primary/20 text-[10px] text-primary hover:bg-primary/10 transition-all cursor-pointer">Explain this alert</button>
                        <button className="w-full text-left p-2 rounded border border-primary/20 text-[10px] text-primary hover:bg-primary/10 transition-all cursor-pointer">How to mitigate DDoS attacks?</button>
                        <button className="w-full text-left p-2 rounded border border-primary/20 text-[10px] text-primary hover:bg-primary/10 transition-all cursor-pointer">Check IP reputation</button>
                    </div>
                    <div className="relative">
                        <input className="w-full bg-black/40 border border-primary/20 rounded-lg py-2 pl-4 pr-10 text-[11px] outline-none focus:border-primary transition-all" placeholder="Ask me anything..." type="text" />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer">send</span>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-[8px] text-on-surface-variant uppercase tracking-widest">RAG Powered • Trained on DANGEN Docs</p>
                    </div>
                </div>

                {/* Bouncing FAB */}
                <div className="relative group cursor-pointer" onClick={() => setIsChatOpen(!isChatOpen)}>
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center bouncing-ai primary-glow relative z-10">
                        <span className="material-symbols-outlined text-black scale-125" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                    </div>
                    {/* Ripple Effects */}
                    <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-slow scale-125"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
