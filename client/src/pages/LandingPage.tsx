import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onEnter: () => void;
}

const NAV_ITEMS = ['Platform', 'Solutions', 'Threat Intel', 'Resources', 'Company'];
const TRUSTED_BRANDS = ['Palo Alto', 'CrowdStrike', 'Microsoft', 'AWS', 'Fortinet'];
const HERO_LABEL = 'CYBER DEFENSE PLATFORM';
const HERO_TITLE = 'DANGEN';
const LOADING_LABEL = 'INITIALIZING DEFENSE PROTOCOL...';
const SCROLL_LABEL = 'SCROLL TO EXPLORE';

const particleMap = [
  { top: '8%', left: '12%', size: 2, opacity: 0.18, delay: 0 },
  { top: '18%', left: '66%', size: 1.5, opacity: 0.2, delay: 0.6 },
  { top: '28%', left: '42%', size: 1.2, opacity: 0.16, delay: 0.3 },
  { top: '42%', left: '88%', size: 1.8, opacity: 0.12, delay: 1 },
  { top: '18%', left: '24%', size: 1.1, opacity: 0.2, delay: 0.4 },
  { top: '58%', left: '12%', size: 1.4, opacity: 0.14, delay: 0.8 },
  { top: '62%', left: '72%', size: 1.6, opacity: 0.15, delay: 0.4 },
  { top: '78%', left: '44%', size: 2.2, opacity: 0.18, delay: 0.9 },
  { top: '84%', left: '18%', size: 1.3, opacity: 0.13, delay: 0.5 },
  { top: '10%', left: '84%', size: 1.7, opacity: 0.16, delay: 1.2 },
];

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);

  const particles = useMemo(
    () => particleMap.map((particle, index) => ({ ...particle, id: index })),
    []
  );

  useEffect(() => {
    let current = 0;
    const interval = window.setInterval(() => {
      current = Math.min(100, current + Math.max(1, Math.floor(Math.random() * 4) + 1));
      setProgress(current);
      if (current >= 100) {
        window.clearInterval(interval);
      }
    }, 120);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,16,60,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,0,64,0.08),transparent_20%),linear-gradient(180deg,rgba(5,5,5,0.96),rgba(8,8,8,0.96))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),transparent_35%,rgba(255,255,255,0.03))] bg-[length:180px_180px] animate-grid-motion pointer-events-none" />
      <div className="absolute inset-0 opacity-80 pointer-events-none">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute block rounded-full bg-white"
            style={{
              top: particle.top,
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-white/5 shadow-[0_0_35px_rgba(255,0,60,0.11)]">
              <div className="h-3 w-3 rounded-full bg-red-400 shadow-[0_0_18px_rgba(255,0,70,0.65)]" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.28em] text-white">DANGEN</div>
              <div className="text-[11px] uppercase tracking-[0.4em] text-gray-400">CYBER DEFENSE</div>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            {NAV_ITEMS.map((item) => (
              <a key={item} href="#" className="transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition hover:border-red-400/50 hover:text-white hover:shadow-[0_0_18px_rgba(255,0,60,0.2)]"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={onEnter}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 hover:text-white hover:shadow-[0_0_25px_rgba(255,0,70,0.28)]"
            >
              Launch Console
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-28 lg:px-8">
        <div className="relative flex w-full flex-col items-center text-center">
          <div className="mb-6 text-[11px] uppercase tracking-[0.45em] text-gray-400">
            {HERO_LABEL}
          </div>

          <div className="relative flex items-center justify-center overflow-visible px-4 py-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute h-96 w-96 rounded-full border border-red-500/15 blur-3xl" />
              <div className="absolute h-[420px] w-[420px] rounded-full border border-white/8 opacity-70" />
              <div className="absolute h-[540px] w-[540px] rounded-full border border-red-400/10 opacity-50 animate-pulse-ring" />
              <div className="absolute h-[280px] w-[280px] rounded-full border border-red-500/20 opacity-40 blur-sm" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="relative flex items-center justify-center"
            >
              <div className="hero-word relative select-none text-7xl font-black uppercase tracking-[0.24em] text-white md:text-[9rem] lg:text-[11rem] xl:text-[12rem]">
                <span className="hero-word-clone hero-word-clone-red">{HERO_TITLE}</span>
                <span className="hero-word-clone hero-word-clone-cyan">{HERO_TITLE}</span>
                <span className="hero-word-highlight" />
                {HERO_TITLE}
              </div>
            </motion.div>
          </div>

          <div className="mt-8 max-w-3xl px-2">
            <p className="text-lg font-light uppercase tracking-[0.35em] text-gray-300 sm:text-xl lg:text-2xl">
              DETECT. ANALYZE. <span className="text-red-300">NEUTRALIZE.</span>
            </p>
          </div>

          <div className="mt-10 flex w-full max-w-3xl flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400">
                <span>{LOADING_LABEL}</span>
                <span>{progress}%</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5 border border-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff2440] via-[#ff4060] to-[#ff92a6] shadow-[0_0_30px_rgba(255,30,80,0.45)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <div className="absolute inset-y-0 right-0 h-full w-12 bg-white/10 blur-sm opacity-40" />
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-gray-500">
                <span>SCANNING THREAT PROTOCOL</span>
                <span>CORE STABILITY {progress < 100 ? 'ACTIVE' : 'STABLE'}</span>
              </div>
            </div>

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_0_45px_rgba(255,0,80,0.12)] backdrop-blur-xl">
              <span className="absolute inset-0 rounded-full border border-red-500/20 blur-xl" />
              <span className="absolute inset-4 rounded-full border border-red-400/20 animate-pulse-ring" />
              <svg viewBox="0 0 56 56" className="relative h-12 w-12 text-red-300" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 24.5C14 17 18 12 28 10c10 2 14 7 14 14.5 0 8.5-6 13.5-15 15-9-1.5-15-6-15-15Z" />
                <path d="M21 24.5c0 4.5 1.7 7.5 6.9 8.4" strokeLinecap="round" />
                <path d="M35 24.5c0 4.5-1.7 7.5-6.9 8.4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      <section className="relative mx-auto mb-24 mt-12 flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gray-500">Trusted by security teams worldwide</p>
        <div className="grid w-full grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-gray-300 shadow-[0_35px_110px_rgba(0,0,0,0.15)] sm:grid-cols-5 sm:px-8 sm:py-8">
          {TRUSTED_BRANDS.map((brand) => (
            <div key={brand} className="flex items-center justify-center text-sm uppercase tracking-[0.25em] text-white/70">
              {brand}
            </div>
          ))}
        </div>
      </section>

      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.4em] text-slate-400">
        <div className="mx-auto mb-3 flex h-14 w-9 flex-col items-center justify-center rounded-full border border-white/10 px-2 py-2">
          <span className="h-3 w-3 rounded-full border border-white/10 bg-white/10" />
          <span className="mt-2 block h-3 w-0.5 rounded-full bg-white/60 animate-scroll-dot" />
        </div>
        <div>{SCROLL_LABEL}</div>
      </div>
    </div>
  );
};

export default LandingPage;
