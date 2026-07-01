// AuthPage.tsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

type AuthView = 'login' | 'register_step1' | 'register_step2' | 'register_step3';
type LoginRole = 'agent' | 'admin';

const API = 'https://creadx-admin-agent-system.onrender.com';

export function LoginPage() {
  const [view, setView]           = useState<AuthView>('login');
  const [loginRole, setLoginRole] = useState<LoginRole>('agent');
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Login fields
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName]         = useState('');
  const [regEmail, setRegEmail]       = useState('');
  const [otp, setOtp]                 = useState(['', '', '', '', '', '']);
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetRegister = () => {
    setRegName(''); setRegEmail('');
    setOtp(['', '', '', '', '', '']);
    setPassword(''); setConfirmPassword('');
    setMessage(null);
  };

  // ─── LOGIN ───────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: loginEmail, password: loginPassword, role: loginRole,
      });
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = res.data.user.role === 'admin' ? '/' : '/agent/dashboard';
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Invalid credentials.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 1: Send OTP ────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your full name.' }); return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await axios.post(`${API}/auth/send-otp`, { email: regEmail, name: regName });
      setView('register_step2');
      setMessage({ type: 'success', text: `Code sent to ${regEmail}` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to send code.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 2: Verify OTP ──────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setMessage({ type: 'error', text: 'Please enter the complete 6-digit code.' }); return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await axios.post(`${API}/auth/verify-otp`, { email: regEmail, code });
      setView('register_step3');
      setMessage(null);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Invalid code.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 3: Set password & create account ───────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' }); return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' }); return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await axios.post(`${API}/auth/register-agent`, { email: regEmail, password });
      resetRegister();
      setView('login');
      setTimeout(() => setMessage({
        type: 'success',
        text: '✅ Account created! An admin will review and approve your profile before you can log in.',
      }), 50);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await axios.post(`${API}/auth/send-otp`, { email: regEmail, name: regName });
      setOtp(['', '', '', '', '', '']);
      setMessage({ type: 'success', text: 'New code sent!' });
      otpRefs.current[0]?.focus();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to resend code.' });
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
            <span className="text-white text-2xl">🌍</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">CreadX</h1>
          <p className="text-sm text-slate-500 mt-1">Tourism Management Platform</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* ── LOGIN ── */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Login as:</label>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['agent', 'admin'] as LoginRole[]).map(role => (
                  <button key={role} type="button"
                    onClick={() => setLoginRole(role)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      loginRole === role ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {role === 'agent' ? '💼 Agent Portal' : '🛡️ System Admin'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
              <input type="email" required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={loginRole === 'admin' ? 'admin@creadx.com' : 'agent@example.com'}
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <input type="password" required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? 'Signing in...' : `Log In as ${loginRole === 'admin' ? 'Admin' : 'Agent'}`}
            </button>

            {loginRole === 'agent' && (
              <div className="text-center pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">New to CreadX? </span>
                <button type="button"
                  className="text-xs text-blue-600 font-bold hover:underline"
                  onClick={() => { resetRegister(); setView('register_step1'); }}
                >
                  Create Agent Account
                </button>
              </div>
            )}
          </form>
        )}

        {/* ── STEP 1: Name + Email ── */}
        {view === 'register_step1' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    s === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>{s}</div>
                  {s < 3 && <div className={`h-0.5 w-8 ${s < 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />}
                </div>
              ))}
              <span className="text-xs text-slate-500 ml-1">Verify Email</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">Create Agent Account</h2>
              <p className="text-xs text-slate-500 mt-1">
                We'll send a verification code to your email.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input type="text" required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Hemanth Chukka"
                value={regName} onChange={e => setRegName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input type="email" required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="hemanth@example.com"
                value={regEmail} onChange={e => setRegEmail(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? 'Sending code...' : 'Send Verification Code →'}
            </button>

            <div className="text-center pt-3 border-t border-slate-100">
              <button type="button"
                className="text-xs text-blue-600 font-bold hover:underline"
                onClick={() => { resetRegister(); setView('login'); }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {view === 'register_step2' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    s <= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>{s <= 1 ? '✓' : s}</div>
                  {s < 3 && <div className={`h-0.5 w-8 ${s <= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />}
                </div>
              ))}
              <span className="text-xs text-slate-500 ml-1">Enter Code</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">Check your email</h2>
              <p className="text-xs text-slate-500 mt-1">
                We sent a 6-digit code to <strong>{regEmail}</strong>. Valid for 10 minutes.
              </p>
            </div>

            {/* OTP boxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-3">
                6-digit code
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading || otp.join('').length < 6}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? 'Verifying...' : 'Verify Code →'}
            </button>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button type="button"
                className="text-xs text-slate-500 hover:text-slate-700"
                onClick={() => { setView('register_step1'); setMessage(null); }}
              >
                ← Back
              </button>
              <button type="button" disabled={loading}
                className="text-xs text-blue-600 font-bold hover:underline disabled:opacity-50"
                onClick={handleResendOtp}
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Set Password ── */}
        {view === 'register_step3' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    s <= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>{s < 3 ? '✓' : s}</div>
                  {s < 3 && <div className="h-0.5 w-8 bg-blue-600" />}
                </div>
              ))}
              <span className="text-xs text-slate-500 ml-1">Set Password</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">Create your password</h2>
              <p className="text-xs text-slate-500 mt-1">
                Almost done! Set a secure password for your account.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required minLength={6}
                  className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="At least 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(s => !s)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password" required
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-blue-500'
                }`}
                placeholder="Repeat password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[11px] text-rose-500 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* What happens next */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-[11px] text-blue-700 font-semibold mb-1">What happens next?</p>
              <ol className="text-[11px] text-blue-600 space-y-0.5 list-decimal list-inside">
                <li>Your account is created instantly</li>
                <li>Admin reviews and approves your profile</li>
                <li>You get access to your agent dashboard</li>
              </ol>
            </div>

            <button type="submit" disabled={loading || password !== confirmPassword}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}