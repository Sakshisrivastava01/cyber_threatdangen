import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = () =>
    window.localStorage.getItem('dangen_auth') === 'true' ||
    window.sessionStorage.getItem('dangen_auth') === 'true';

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem('dangen_auth', 'true');
      storage.setItem('dangen_user', email || 'operator@dangen.io');
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#09060d] text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
        <div className="relative w-full rounded-[2rem] border border-white/10 bg-[#14080f]/80 p-8 shadow-[0_20px_100px_rgba(255,0,60,0.12)] backdrop-blur-xl sm:p-10">
          <div className="absolute inset-x-6 top-0 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-600/25 via-transparent to-pink-500/20 blur-3xl" />
          <div className="relative space-y-10 lg:flex lg:items-center lg:justify-between lg:space-y-0">
            <div className="max-w-xl space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300/80">Enterprise access</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Secure platform login for DANGEN Cyber Defense
              </h1>
              <p className="max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
                Authenticate to continue. Strong access controls and session isolation keep your security operations protected.
              </p>
            </div>

            <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-[#08040a]/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-[#0d0810]/90 px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Password
                  </label>
                  <div className="relative mt-3">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#0d0810]/90 px-4 py-3 pr-12 text-sm text-white outline-none transition duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                      placeholder="Enter secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex items-center gap-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="h-4 w-4 rounded border-gray-500 bg-[#0d0810] text-red-500 accent-red-500 focus:ring-red-400"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-sm font-medium text-red-300 transition hover:text-white">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-pink-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-red-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(255,0,90,0.22)] focus:outline-none focus:ring-2 focus:ring-red-400/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[1.5rem] border border-white/5 bg-white/5 px-6 py-5 text-sm text-gray-400 backdrop-blur-xl sm:flex sm:items-center sm:justify-between">
            <p>Premium enterprise SaaS security experience built for modern cyber operations.</p>
            <span className="mt-4 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-red-200 sm:mt-0">
              Responsive / Secure / Refined
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
