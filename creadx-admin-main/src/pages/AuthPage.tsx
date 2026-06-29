// AuthPage.tsx
import React, { useState } from 'react';
import axios from 'axios';

type AuthView = 'login' | 'register_agent';
type LoginRole = 'agent' | 'admin';

const API = 'https://creadx-admin-agent-system.onrender.com';

export function LoginPage() {
  const [view, setView] = useState<AuthView>('login');
  const [loginRole, setLoginRole] = useState<LoginRole>('agent');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ─── Login ───────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password,
        role: loginRole,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Fixed: admin goes to '/' (dashboard), not '/users'
        if (response.data.user.role === 'admin') {
          window.location.href = '/';
        } else {
          window.location.href = '/agent/dashboard';
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error
        || 'Invalid credentials. Please check your email and password.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ────────────────────────────────────────────────
  const handleAgentRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend validation
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API}/auth/register-agent`, {
        name: fullName,
        email,
        password,
      });

      if (response.data?.success) {
        setFullName('');
        setEmail('');
        setPassword('');
        setView('login');
        // Show success message on login screen
        setTimeout(() => {
          setMessage({
            type: 'success',
            text: '✅ Account created! An admin will review and approve your profile. You can log in once approved.',
          });
        }, 50);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error
        || 'Registration failed. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="text-white text-2xl font-bold">🌍</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">CreadX</h1>
          <p className="text-sm text-slate-500 mt-1">Tourism Management Platform</p>
        </div>

        {/* Alert message */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* ── LOGIN VIEW ── */}
        {view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Role toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Login as:
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLoginRole('agent')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${
                    loginRole === 'agent'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  💼 Agent Portal
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('admin')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${
                    loginRole === 'admin'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  🛡️ System Admin
                </button>
              </div>
            </div>

            <h2 className="text-md font-bold text-slate-800 capitalize">
              {loginRole === 'admin' ? 'Admin' : 'Agent'} Sign In
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={loginRole === 'admin' ? 'admin@creadx.com' : 'agent@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? 'Signing in...' : `Log In as ${loginRole === 'admin' ? 'Admin' : 'Agent'}`}
            </button>

            {/* Only show register link for agent login */}
            {loginRole === 'agent' && (
              <div className="text-center mt-5 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">New to CreadX? </span>
                <button
                  type="button"
                  className="text-xs text-blue-600 font-bold hover:underline"
                  onClick={() => { setView('register_agent'); setMessage(null); }}
                >
                  Create Agent Account
                </button>
              </div>
            )}
          </form>

        ) : (
          /* ── REGISTER VIEW ── */
          <form onSubmit={handleAgentRegister} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-md font-bold text-slate-800">Become an Agent Partner</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md uppercase border border-emerald-200">
                Registration Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Create your account to start managing tours and bookings. An admin will review and activate your profile.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Hemanth Chukka"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="hemanth@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[10px] text-slate-400 mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? 'Creating your account...' : 'Register Agent Profile'}
            </button>

            {/* What happens next info box */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-[11px] text-blue-700 font-semibold mb-1">What happens next?</p>
              <ol className="text-[11px] text-blue-600 space-y-0.5 list-decimal list-inside">
                <li>Your account is created instantly</li>
                <li>Admin reviews and approves your profile</li>
                <li>You receive access to your agent dashboard</li>
              </ol>
            </div>

            <div className="text-center mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                className="text-xs text-blue-600 font-bold hover:underline"
                onClick={() => { setView('login'); setMessage(null); }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}