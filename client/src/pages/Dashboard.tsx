import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const baseMetrics = [
  { label: 'Detected Events', target: 8142, trend: '+12.7%', hint: '24h active sensors', suffix: '' },
  { label: 'Critical Incidents', target: 57, trend: '+4.2%', hint: 'Priority response queue', suffix: '' },
  { label: 'Threat Coverage', target: 98.4, trend: '+1.9%', hint: 'Global telemetry reach', suffix: '%' },
  { label: 'Mean Dwell', target: 2.1, trend: '-8.1%', hint: 'Containment performance', suffix: 'h', decimals: 1 },
];

const regions = [
  { name: 'Singapore', count: 18, level: 'High' },
  { name: 'Frankfurt', count: 12, level: 'Elevated' },
  { name: 'São Paulo', count: 9, level: 'Medium' },
  { name: 'Toronto', count: 7, level: 'Medium' },
];

const feedItems = [
  { time: '00:14:38', title: 'Ransomware payload blocked', source: 'Egress proxy', severity: 'Critical' },
  { time: '00:12:15', title: 'Unknown process flagged', source: 'Endpoint', severity: 'High' },
  { time: '00:09:56', title: 'Credentials brute force', source: 'IAM gateway', severity: 'Elevated' },
  { time: '00:06:42', title: 'Suspicious C2 heartbeat', source: 'Network sensor', severity: 'Critical' },
];

const alerts = [
  { id: 'AL-0912', description: 'New phishing kit discovered in inbound mail flow.', severity: 'High' },
  { id: 'AL-0897', description: 'Data exfiltration attempt from legacy API.', severity: 'Critical' },
  { id: 'AL-0883', description: 'Anomalous DNS tunneling activity.', severity: 'Elevated' },
];

const ThreatIndicator = React.memo(() => (
  <div className="glass-panel overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07090f]/90 p-5 sm:p-6 transition duration-300 hover:-translate-y-0.5 hover:border-red-400/35">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Threat Intelligence</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Signal summary</h2>
      </div>
      <span className="rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.34em] text-red-200">
        Pulse
      </span>
    </div>
    <div className="mt-6 space-y-4 text-sm text-gray-300">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">Threat model confidence</p>
        <p className="mt-2 text-xs text-gray-400">Deep correlation across endpoint, network, and cloud telemetry.</p>
      </div>
      <div className="grid gap-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-gray-400">
          <span>IOC match rate</span>
          <span>87%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-[#ff9aa4]" style={{ width: '87%' }} />
        </div>
      </div>
      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between text-gray-300">
          <span>Malware signatures</span>
          <strong className="text-red-200">42</strong>
        </div>
        <div className="flex items-center justify-between text-gray-300">
          <span>Active watchlists</span>
          <strong className="text-red-200">7</strong>
        </div>
      </div>
    </div>
  </div>
));

// Small presentational subcomponents memoized to avoid unnecessary re-renders
interface MetricType { label: string; target: number; trend: string; hint: string; suffix?: string; decimals?: number }
const MetricCard = React.memo(({ metric, value, progress }: { metric: MetricType; value: number; progress: number }) => (
  <div className="glass-panel rounded-[1.75rem] border border-white/10 bg-[#070812]/90 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.16)] transition duration-200 hover:-translate-y-0.5 hover:border-red-400/35 hover:bg-white/10">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">{metric.label}</p>
      <span className="text-xs text-green-300">{metric.trend}</span>
    </div>
    <div className="mt-4 flex items-end justify-between gap-4">
      <p className="text-3xl font-semibold text-white">{metric.suffix === '%' ? `${value.toFixed(1)}%` : metric.suffix === 'h' ? `${value.toFixed(1)}h` : Math.round(value).toLocaleString()}</p>
      <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-[#ff8fa0] shadow-[0_0_18px_rgba(255,0,60,0.35)]" style={{ width: `${progress}%` }} />
      </div>
    </div>
    <p className="mt-3 text-sm text-gray-400">{metric.hint}</p>
  </div>
));

const RegionCard = React.memo(({ region }: { region: (typeof regions)[number] }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-red-400/30 hover:bg-white/10">
    <div className="flex items-center justify-between gap-2 text-sm text-gray-300">
      <span>{region.name}</span>
      <span className="text-red-300">{region.level}</span>
    </div>
    <p className="mt-3 text-3xl font-semibold text-white">{region.count}</p>
  </div>
));

const FeedItemCard = React.memo(({ item }: { item: (typeof feedItems)[number] }) => (
  <div className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-red-400/40 hover:bg-white/10">
    <div className="flex items-center justify-between gap-3 text-sm text-gray-400">
      <span>{item.time}</span>
      <span className="rounded-full bg-[#18040a] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-red-200">{item.severity}</span>
    </div>
    <p className="mt-3 text-base font-semibold text-white">{item.title}</p>
    <p className="mt-2 text-sm text-gray-400">{item.source}</p>
  </div>
));

const AlertCard = React.memo(({ alert }: { alert: (typeof alerts)[number] }) => (
  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-red-400/40 hover:bg-white/10">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-white">{alert.id}</p>
        <p className="mt-1 text-sm text-gray-400">{alert.description}</p>
      </div>
      <span className="rounded-full bg-red-500/15 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-red-200">{alert.severity}</span>
    </div>
  </div>
));

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<number[]>(baseMetrics.map(() => 0));
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
      setCounts((current) =>
        current.map((value, index) => {
          const target = baseMetrics[index].target;
          if (value >= target) return target;
          const step = Math.max(target / 18, 0.1);
          return Math.min(target, Number((value + step).toFixed(1)));
        })
      );
    }, 120);
    return () => window.clearInterval(interval);
  }, []);

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem('dangen_auth');
    window.localStorage.removeItem('dangen_user');
    window.sessionStorage.removeItem('dangen_auth');
    window.sessionStorage.removeItem('dangen_user');
    navigate('/login');
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06090f] text-white px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(255,0,60,0.08),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),transparent_35%,rgba(255,255,255,0.04))] bg-[length:180px_180px] opacity-30" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#07090f]/90 p-5 shadow-[0_40px_120px_rgba(255,0,60,0.08)] backdrop-blur-xl transition duration-300 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-red-300/70">Dashboard</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Operational console</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                <span className="font-medium text-white">{user}</span>
                <div className="mt-1 text-xs uppercase tracking-[0.28em] text-red-300/70">Analyst profile</div>
              </div>
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm uppercase tracking-[0.25em] text-red-200">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="glass-panel z-10 flex flex-col gap-6 rounded-[2rem] border border-red-500/15 bg-[#07080f]/90 p-6 shadow-[0_40px_120px_rgba(255,0,60,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5">
            <div className="space-y-5">
              <div className="rounded-[1.75rem] border border-white/10 bg-[#08060d]/80 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">Session</p>
                <div className="mt-4 text-lg font-semibold text-white">{user}</div>
                <p className="mt-2 text-sm text-gray-400">Persistent access enabled</p>
              </div>
              <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                {[
                  { label: 'Access', value: 'Protected' },
                  { label: 'Tier', value: 'Enterprise' },
                  { label: 'Mode', value: 'Live Monitoring' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-[#080610]/80 p-4 text-sm text-gray-300 transition hover:border-red-400/40 hover:bg-white/10">
                    <div className="uppercase tracking-[0.32em] text-[10px] text-red-300/70">{item.label}</div>
                    <div className="mt-2 text-base font-semibold text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-auto rounded-3xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-500/20 hover:text-white"
            >
              Logout
            </button>
          </aside>

          <main className="relative z-10 space-y-6">
            <section className="glass-panel rounded-[2rem] border border-red-500/15 bg-[#070a14]/90 p-8 shadow-[0_30px_100px_rgba(255,0,60,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-3">
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300/80">Command Center</p>
                  <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">DANGEN Command Center</h1>
                  <p className="text-base leading-7 text-gray-400 sm:text-lg">
                    Enterprise threat posture and live incident telemetry in a single secure command surface.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-200">
                    Secure mode
                  </span>
                  <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-gray-300">
                    Persistent session live
                  </span>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {useMemo(() => baseMetrics.map((metric, index) => {
                const progress = Math.min(100, Math.round((counts[index] / metric.target) * 100));
                return <MetricCard key={metric.label} metric={metric} value={counts[index]} progress={progress} />;
              }), [counts])}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.9fr_1fr]">
              <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070a16]/90 p-6 sm:p-8 shadow-[0_40px_120px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#ff003c]/15 to-transparent" />
                <div className="flex items-center justify-between gap-3 pb-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">Threat map</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Global intrusion vector</h2>
                  </div>
                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-red-200">
                    Live view
                  </span>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-[#060811] p-6 shadow-[inset_0_0_0_1px_rgba(255,0,60,0.08)]">
                  <div className="relative h-[320px] overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#070712]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,0,60,0.16),transparent_18%),radial-gradient(circle_at_72%_22%,rgba(255,255,255,0.08),transparent_16%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),transparent_30%,rgba(255,255,255,0.04))] bg-[length:220px_220px] opacity-30" />
                    <div className="absolute left-10 top-14 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,60,0.55)]" />
                    <div className="absolute left-24 top-28 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.28)]" />
                    <div className="absolute right-20 top-24 h-3 w-3 rounded-full bg-red-300 shadow-[0_0_14px_rgba(255,0,60,0.3)]" />
                    <div className="absolute right-16 bottom-20 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.18)]" />
                    <div className="absolute left-1/2 top-20 h-0.5 w-36 rounded-full bg-white/10 blur-sm" />
                    <div className="absolute left-24 bottom-16 h-0.5 w-44 rounded-full bg-white/10 blur-sm" />
                    <div className="absolute right-8 bottom-8 h-0.5 w-20 rounded-full bg-red-500/30" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="grid grid-cols-2 gap-3 text-[11px] uppercase tracking-[0.3em] text-red-200 text-opacity-80">
                        <span>Singapore</span>
                        <span>Frankfurt</span>
                        <span>São Paulo</span>
                        <span>Toronto</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {regions.map((region) => (
                    <RegionCard key={region.name} region={region} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <ThreatIndicator />
                <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#07090f]/90 p-5 sm:p-6 shadow-[0_40px_120px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-3 pb-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">Threat severity</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Severity distribution</h2>
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-gray-400">24h</span>
                  </div>
                  <div className="mt-6 grid gap-4">
                    {[
                      { label: 'Critical', value: '42%', color: 'from-red-500 to-[#ff4f6d]', width: 'w-[42%]' },
                      { label: 'High', value: '28%', color: 'from-red-400 to-[#ff7a95]', width: 'w-[28%]' },
                      { label: 'Elevated', value: '18%', color: 'from-white/25 to-white/10', width: 'w-[18%]' },
                      { label: 'Low', value: '12%', color: 'from-white/15 to-white/5', width: 'w-[12%]' },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full rounded-full bg-gradient-to-r ${item.color} shadow-[0_0_12px_rgba(255,0,60,0.22)] ${item.width}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#07090f]/90 p-6 sm:p-7 shadow-[0_40px_120px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">Live threat feed</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Active event stream</h2>
                  </div>
                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-red-200">
                    4 new
                  </span>
                </div>
                <div className="space-y-4">
                  {feedItems.map((item) => (
                    <FeedItemCard key={item.time} item={item} />
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#07090f]/90 p-6 sm:p-7 shadow-[0_40px_120px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">Recent alerts</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Priority notifications</h2>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Latest</span>
                </div>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
