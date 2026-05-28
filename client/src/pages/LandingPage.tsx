import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiCpu,
  FiZap,
  FiBarChart2,
  FiCheckCircle,
  FiArrowRight,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = ['Platform', 'Solutions', 'Resources', 'Company', 'Pricing'];
const FEATURE_CARDS = [
  {
    title: 'Real-time Protection',
    description: '24/7 monitoring and threat containment across your enterprise perimeter.',
    icon: FiShield,
  },
  {
    title: 'AI Threat Intelligence',
    description: 'Advanced models analyze patterns and detect emerging attack behavior.',
    icon: FiCpu,
  },
  {
    title: 'Auto Response',
    description: 'Autonomous risk mitigation that neutralizes threats before they escalate.',
    icon: FiZap,
  },
  {
    title: 'Comprehensive Insights',
    description: 'Actionable security analytics with clear enterprise-grade reporting.',
    icon: FiBarChart2,
  },
];
const AVATAR_OPTIONS = ['A', 'B', 'C', 'D'];
const EMAIL_OTP = '741852';
const MOBILE_OTP = '369258';
const HERO_LABEL = 'AI POWERED CYBER DEFENSE';
const HERO_TITLE = 'DANGEN';
const DESCRIPTION = 'Detect. Analyze. Neutralize. DANGEN protects your digital world with real-time threat intelligence and autonomous defense.';
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

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const [signupStage, setSignupStage] = useState<'form' | 'emailOtp' | 'mobileOtp' | 'completed'>('form');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRemember, setLoginRemember] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupAvatar, setSignupAvatar] = useState(0);
  const [signupFirst, setSignupFirst] = useState('');
  const [signupLast, setSignupLast] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [mobileOtpCode, setMobileOtpCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const openLoginModal = () => {
    setModalType('login');
    setSignupStage('form');
    setVerificationError('');
    setSuccessMessage('');
  };

  const openSignupModal = () => {
    setModalType('signup');
    setSignupStage('form');
    setVerificationError('');
    setSuccessMessage('');
  };

  const closeModal = () => {
    setModalType(null);
    setSignupStage('form');
    setVerificationError('');
  };

  const handleLoginSubmit = () => {
    if (loginLoading) return;
    setLoginLoading(true);
    window.setTimeout(() => {
      setLoginLoading(false);
      const storage = loginRemember ? window.localStorage : window.sessionStorage;
      storage.setItem('dangen_auth', 'true');
      storage.setItem('dangen_user', loginEmail || 'operator@dangen.io');
      navigate('/dashboard');
    }, 900);
  };

  const handleSignupSubmit = () => {
    setSignupStage('emailOtp');
    setVerificationError('');
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtpCode.trim() === EMAIL_OTP) {
      setSignupStage('mobileOtp');
      setVerificationError('');
    } else {
      setVerificationError('Invalid email OTP. Please try again.');
    }
  };

  const handleVerifyMobileOtp = () => {
    if (mobileOtpCode.trim() === MOBILE_OTP) {
      setSignupStage('completed');
      setVerificationError('');
      window.setTimeout(() => {
        setModalType('login');
        setSignupStage('form');
        setSuccessMessage('Account created. Please login to continue.');
        setEmailOtpCode('');
        setMobileOtpCode('');
      }, 1200);
    } else {
      setVerificationError('Invalid mobile OTP. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,43,69,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,0,64,0.08),transparent_22%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,17,48,0.035),transparent_18%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),transparent_36%,rgba(255,255,255,0.03))] bg-[length:220px_220px] opacity-40 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-[18%] h-[420px] w-[420px] rounded-full border border-red-500/10 opacity-50 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/10 opacity-50" />
        <div className="absolute top-1/2 left-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/20 opacity-45" />
        <div className="absolute top-1/2 left-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-400/20 opacity-65 animate-radar-sweep" />
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute block rounded-full bg-white/90"
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

      <header className="fixed inset-x-0 top-0 z-50 border-b border-red-500/10 bg-[#0b0b0b]/45 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-white/5 shadow-[0_0_18px_rgba(255,0,60,0.16)]">
              <FiShield className="h-5 w-5 text-red-300" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold tracking-[0.35em] text-white">DANGEN</div>
              <div className="text-[11px] uppercase tracking-[0.45em] text-gray-400">AI CYBER DEFENSE</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            {NAV_ITEMS.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition duration-200 ease-out hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openLoginModal}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition duration-200 ease-out hover:border-red-400/50 hover:text-white hover:shadow-[0_0_18px_rgba(255,0,60,0.18)]"
            >
              Login
            </button>
            <button
              type="button"
              onClick={openLoginModal}
              className="button-glow rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-200 transition duration-200 ease-out hover:bg-red-500/15 hover:text-white"
            >
              Launch Console
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-200 transition duration-200 ease-out hover:border-red-400/50 hover:text-white md:hidden"
            >
              <FiMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-6 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-white/5">
                  <FiShield className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-[0.35em] text-white">DANGEN</div>
                  <div className="text-[11px] uppercase tracking-[0.45em] text-gray-400">AI CYBER DEFENSE</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-200 transition hover:border-red-400/50 hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-4 text-2xl font-semibold text-white">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="transition duration-200 ease-out hover:text-red-300"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  openLoginModal();
                }}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition duration-200 ease-out hover:border-red-400/50 hover:bg-white/10"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  openLoginModal();
                }}
                className="button-glow rounded-full bg-gradient-to-r from-[#ff2b45] via-[#ff4a6d] to-[#ff8fa6] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_60px_rgba(255,43,69,0.22)] transition duration-200 ease-out hover:-translate-y-0.5"
              >
                Launch Console
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative z-10 flex w-full flex-col items-center text-center"
        >
          <div className="mb-5 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-gray-300 shadow-[0_0_24px_rgba(255,0,60,0.08)] backdrop-blur-sm">
            {HERO_LABEL}
          </div>

          <div className="relative flex items-center justify-center overflow-visible px-4 py-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[280px] w-[280px] rounded-full border border-red-500/12 opacity-55 blur-2xl" />
              <div className="absolute h-[340px] w-[340px] rounded-full border border-red-500/10 opacity-45" />
              <div className="absolute h-[240px] w-[240px] rounded-full border border-red-400/12 opacity-60 animate-radar-sweep" />
              <div className="absolute left-0 top-1/3 h-0.5 w-20 rounded-full bg-red-500/15 blur-sm" />
              <div className="absolute right-0 bottom-1/3 h-0.5 w-16 rounded-full bg-red-500/15 blur-sm" />
            </div>

            <div className="relative text-white">
              <h1 className="hero-word relative select-none text-[4.8rem] font-orbitron font-black uppercase leading-[0.82] tracking-[-0.04em] text-white drop-shadow-[0_0_32px_rgba(255,43,69,0.28)] sm:text-[6rem] md:text-[7.2rem] lg:text-[8.2rem] xl:text-[8.8rem]">
                <span className="hero-word-clone hero-word-clone-red">{HERO_TITLE}</span>
                <span className="hero-word-clone hero-word-clone-white">{HERO_TITLE}</span>
                <span className="hero-word-highlight" />
                {HERO_TITLE}
              </h1>
              <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-24 w-full max-w-3xl bg-gradient-to-r from-transparent via-[#ff2b45]/12 to-transparent blur-2xl opacity-55" />
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg md:text-xl">
            {DESCRIPTION}
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={openLoginModal}
              className="button-glow inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff2b45] via-[#ff4a63] to-[#ff7e9c] px-8 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_20px_70px_rgba(255,43,69,0.22)] transition duration-200 hover:-translate-y-0.5"
            >
              Launch Console
              <FiArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition duration-200 hover:border-red-400/40 hover:bg-white/10"
            >
              Explore Platform
            </button>
          </div>
        </motion.div>
      </main>

      <section id="features" className="relative mx-auto mb-24 max-w-7xl px-6 lg:px-8">
        <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0d0b10]/80 p-10 shadow-[0_40px_120px_rgba(255,0,60,0.12)] backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-4 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-red-300/80">Feature overview</p>
            <h2 className="font-orbitron text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-5xl">
              Refined enterprise guardrails.
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              A minimal premium experience for security operations, blending advanced AI threat defense with a modern matte interface.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="glass-panel relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#090607]/70 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-red-400/25"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-red-500/25 bg-red-500/10 text-red-200 shadow-[0_0_16px_rgba(255,0,60,0.12)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#080708]/95 p-6 shadow-[0_40px_150px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-sm text-gray-400 transition hover:text-white"
            >
              Close
            </button>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-red-300/80">{modalType === 'login' ? 'Secure access' : 'Start your onboarding'}</p>
                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-4xl">
                  {modalType === 'login' ? 'Login to DANGEN Console' : 'Create your DANGEN profile'}
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-gray-400">
                  {modalType === 'login'
                    ? 'Authenticate with enterprise credentials to access threat telemetry and management controls.'
                    : 'Choose an avatar, verify your contact channels, and unlock premium console access.'}
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-[#0d0d10]/90 p-6">
                {modalType === 'login' ? (
                  <div className="space-y-5">
                    {successMessage && (
                      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                        {successMessage}
                      </div>
                    )}
                    <label className="block text-sm uppercase tracking-[0.24em] text-gray-400">Email address</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                      placeholder="operator@dangen.io"
                      className="w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    />
                    <label className="block text-sm uppercase tracking-[0.24em] text-gray-400">Password</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      placeholder="Enter secure password"
                      className="w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    />
                    <div className="flex items-center justify-between gap-3 text-sm text-gray-300">
                      <label className="inline-flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={loginRemember}
                          onChange={(event) => setLoginRemember(event.target.checked)}
                          className="h-4 w-4 rounded border-gray-500 bg-[#070708] text-red-500 accent-red-500"
                        />
                        Remember me
                      </label>
                      <button type="button" className="text-sm font-medium text-red-300 transition hover:text-white">
                        Forgot password?
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleLoginSubmit}
                      disabled={loginLoading}
                      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff2b45] via-[#ff4a6d] to-[#ff8fa6] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_60px_rgba(255,43,69,0.24)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loginLoading ? 'Logging in…' : 'Login'}
                    </button>
                    <div className="border-t border-white/10 pt-4 text-sm text-gray-300">
                      New to DANGEN?{' '}
                      <button type="button" onClick={openSignupModal} className="font-semibold text-white transition hover:text-red-300">
                        Create account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {signupStage === 'form' && (
                      <>
                        <div>
                          <p className="text-sm uppercase tracking-[0.22em] text-gray-400">Select avatar</p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            {AVATAR_OPTIONS.map((avatar, index) => (
                              <button
                                key={avatar}
                                type="button"
                                onClick={() => setSignupAvatar(index)}
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl border px-3 text-xl font-semibold transition ${signupAvatar === index ? 'border-red-400 bg-red-500/15 text-red-200' : 'border-white/10 bg-[#09090c] text-gray-200'}`}
                              >
                                {avatar}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block text-sm uppercase tracking-[0.22em] text-gray-400">
                            First Name
                            <input
                              type="text"
                              value={signupFirst}
                              onChange={(event) => setSignupFirst(event.target.value)}
                              placeholder="Ava"
                              className="mt-3 w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                            />
                          </label>
                          <label className="block text-sm uppercase tracking-[0.22em] text-gray-400">
                            Last Name
                            <input
                              type="text"
                              value={signupLast}
                              onChange={(event) => setSignupLast(event.target.value)}
                              placeholder="Nox"
                              className="mt-3 w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                            />
                          </label>
                        </div>
                        <label className="block text-sm uppercase tracking-[0.22em] text-gray-400">
                          Email address
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={(event) => setSignupEmail(event.target.value)}
                            placeholder="team@enterprise.com"
                            className="mt-3 w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                          />
                        </label>
                        <label className="block text-sm uppercase tracking-[0.22em] text-gray-400">
                          Mobile number
                          <input
                            type="tel"
                            value={signupMobile}
                            onChange={(event) => setSignupMobile(event.target.value)}
                            placeholder="+1 555 014 7890"
                            className="mt-3 w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                          />
                        </label>
                        <label className="block text-sm uppercase tracking-[0.22em] text-gray-400">
                          Password
                          <input
                            type="password"
                            value={signupPassword}
                            onChange={(event) => setSignupPassword(event.target.value)}
                            placeholder="Create a secure password"
                            className="mt-3 w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleSignupSubmit}
                          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff2b45] via-[#ff4a6d] to-[#ff8fa6] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_60px_rgba(255,43,69,0.24)] transition duration-200 hover:-translate-y-0.5"
                        >
                          Continue to verification
                        </button>
                      </>
                    )}

                    {signupStage === 'emailOtp' && (
                      <>
                        <p className="text-sm text-gray-300">We sent an OTP to {signupEmail || 'your email address'}.</p>
                        <label className="block text-sm uppercase tracking-[0.22em] text-gray-400">
                          Email OTP
                          <input
                            type="text"
                            value={emailOtpCode}
                            onChange={(event) => setEmailOtpCode(event.target.value)}
                            placeholder="Enter OTP code"
                            className="mt-3 w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                          />
                        </label>
                        {verificationError && <p className="text-sm text-red-300">{verificationError}</p>}
                        <button
                          type="button"
                          onClick={handleVerifyEmailOtp}
                          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff2b45] via-[#ff4a6d] to-[#ff8fa6] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_60px_rgba(255,43,69,0.24)] transition duration-200 hover:-translate-y-0.5"
                        >
                          Verify email OTP
                        </button>
                      </>
                    )}

                    {signupStage === 'mobileOtp' && (
                      <>
                        <p className="text-sm text-gray-300">Now verify your mobile number: {signupMobile || '+...'}.</p>
                        <label className="block text-sm uppercase tracking-[0.22em] text-gray-400">
                          Mobile OTP
                          <input
                            type="text"
                            value={mobileOtpCode}
                            onChange={(event) => setMobileOtpCode(event.target.value)}
                            placeholder="Enter OTP code"
                            className="mt-3 w-full rounded-3xl border border-white/10 bg-[#070708]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                          />
                        </label>
                        {verificationError && <p className="text-sm text-red-300">{verificationError}</p>}
                        <button
                          type="button"
                          onClick={handleVerifyMobileOtp}
                          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff2b45] via-[#ff4a6d] to-[#ff8fa6] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_60px_rgba(255,43,69,0.24)] transition duration-200 hover:-translate-y-0.5"
                        >
                          Confirm mobile OTP
                        </button>
                      </>
                    )}

                    {signupStage === 'completed' && (
                      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center text-white">
                        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-200">
                          <FiCheckCircle />
                        </div>
                        <h3 className="text-xl font-semibold">Signup complete</h3>
                        <p className="mt-2 text-sm text-gray-200">Your identity is verified. Opening login screen now.</p>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-4 text-sm text-gray-300">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="font-semibold text-white transition hover:text-red-300"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
