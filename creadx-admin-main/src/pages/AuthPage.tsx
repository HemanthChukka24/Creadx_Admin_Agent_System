import React, { useState } from 'react';
import axios from 'axios';

type AuthView = 'login' | 'register_agent';
type LoginRole = 'agent' | 'admin';

export function LoginPage() {
  const [view, setView] = useState<AuthView>('login');
  const [loginRole, setLoginRole] = useState<LoginRole>('agent');
  
  // Form State Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 🔑 Handle Standard Login Submission (Supports both Admin & Agent roles)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post('https://creadx-admin-agent-system.onrender.com/auth/login', {
        email,
        password,
        role: loginRole // Dynamically passes 'admin' or 'agent'
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // 🚀 Route seamlessly to their respective workspaces
        if (response.data.user.role === 'admin') {
          window.location.href = '/users'; // Triggers Admin dashboard workspace entry route
        } else {
          window.location.href = '/agent/dashboard'; // Triggers Agent dashboard route
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Invalid credentials or matching profile profile not found.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // 🚖 Handle New Agent Profile Registration
  const handleAgentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post('https://creadx-admin-agent-system.onrender.com/auth/register-agent', {
        email,
        password,
        name: fullName
      });

      if (response.data && response.data.success) {
        setMessage({ type: 'success', text: 'Agent profile created successfully! You can now log in.' });
        setFullName('');
        setEmail('');
        setPassword('');
        setLoginRole('agent'); // Default to agent view choice
        setView('login'); // Drop them right back into login workspace panel
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to initialize agent registration workspace profile.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        
        {/* Header Branding Info */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="text-white text-2xl font-bold">🌍</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">TourismApp</h1>
          <p className="text-sm text-slate-500 mt-1">Unified Control Management Hub</p>
        </div>

        {/* System Alert Status Messages */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {message.text}
          </div>
        )}

        {/* ====================================
            VIEW PANEL 1: UNIFIED SIGN-IN FORMS
            ==================================== */}
        {view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Native App-Style Role Toggle Switch */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">Access Level Configuration:</label>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${loginRole === 'agent' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  onClick={() => setLoginRole('agent')}
                >
                  💼 Agent Portal
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${loginRole === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  onClick={() => setLoginRole('admin')}
                >
                  🛡️ System Admin
                </button>
              </div>
            </div>

            <h2 className="text-md font-bold text-slate-800 capitalize mb-1">{loginRole} Verification Sign-In</h2>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-blue-500"
                placeholder={loginRole === 'admin' ? 'admin@creadx.com' : 'anita@creadx.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? 'Validating Profile Credentials...' : `Log In as ${loginRole}`}
            </button>

            {/* Dynamic Footnotes to Allow Agent Signup Action */}
            <div className="text-center mt-5 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">Want to run tour operations? </span>
              <button 
                type="button"
                className="text-xs text-blue-600 font-bold hover:underline"
                onClick={() => { setView('register_agent'); setMessage(null); }}
              >
                Create Agent Account
              </button>
            </div>
          </form>
        ) : (
          
          /* ====================================
             VIEW PANEL 2: AGENT CREATION PANEL EXCLUSIVE
             ==================================== */
          <form onSubmit={handleAgentRegister} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-md font-bold text-slate-800">Become an Agent Partner</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md uppercase border border-emerald-200">Registration Portal</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Create your professional profile row to access client trip logs and metrics.</p>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Operator Name</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-blue-500"
                placeholder="Anita Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Professional Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-blue-500"
                placeholder="anita@creadx.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Secure Password</label>
              <input 
                type="password" 
                required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? 'Generating System Entry...' : 'Register Agent Profile'}
            </button>

            <div className="text-center mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button 
                type="button"
                className="text-xs text-blue-600 font-bold hover:underline"
                onClick={() => { setView('login'); setMessage(null); }}
              >
                Return to Portal Access Screen
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}