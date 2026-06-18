import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, Briefcase, Plane, AlertCircle, Loader2 } from 'lucide-react';
import { adminApi } from '../lib/api'; // Bridges to your backend copy

type UserType = 'admin' | 'agent';

export const LoginPage = () => {
  const [userType, setUserType] = useState<UserType>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 📡 Request login from your backend
      const response = await adminApi.post('/auth/login', {
        email,
        password,
        role: userType,
      });

      const { token } = response.data;
      
      // 🔥 FIXED: Standardize local storage fields to match App.tsx exactly
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role: userType }));

      // 🔀 Route based on option clicked
      if (userType === 'admin') {
        window.location.href = "/"; // Force-reboots straight to Admin view smoothly
      } else {
        window.location.href = "/agent/dashboard"; // Bounces agent straight to Agent view
      }
    } catch (error) {
      console.error("Login Error details:", error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-4 py-8">
      <div className="w-full max-w-[420px] flex flex-col items-center justify-center">
        
        {/* Header Section */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center w-20 h-20 rounded-full bg-[#0a7fd6] text-white shadow-lg shadow-[#0a7fd6]/30">
            <Plane className="w-10 h-10 rotate-45" />
          </div>
          <h1 className="text-2xl font-bold text-[#0a1f3b] mb-2">TourismApp Portal</h1>
          <p className="text-sm text-gray-500 font-medium">Travel with Confidence</p>
        </div>

        {/* Content Box */}
        <div className="w-full bg-white border border-gray-200 rounded-xl p-7 shadow-sm">
          {/* Toggle Section */}
          <div className="mb-8">
            <span className="text-sm font-semibold text-gray-700 block mb-3">Login as:</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 transition-all font-semibold text-xs ${
                  userType === 'admin'
                    ? 'bg-[#0a7fd6] border-[#0a7fd6] text-white'
                    : 'bg-white border-[#0a7fd6] text-[#0a7fd6] hover:bg-gray-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setUserType('agent')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 transition-all font-semibold text-xs ${
                  userType === 'agent'
                    ? 'bg-[#0a7fd6] border-[#0a7fd6] text-white'
                    : 'bg-white border-[#0a7fd6] text-[#0a7fd6] hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Agent
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <h2 className="text-base font-bold text-[#0a1f3b] mb-4">
              {userType === 'admin' ? 'Admin' : 'Agent'} Login
            </h2>

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Email Address</label>
              <div className={`flex items-center gap-2.5 bg-white border rounded-lg px-3 py-2.5 shadow-sm transition-colors ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-200'}`}>
                <Mail className="w-4 h-4 text-[#0a7fd6]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className="w-full text-sm outline-none bg-transparent text-gray-800 placeholder-gray-300"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-medium pl-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Password</label>
              <div className={`flex items-center gap-2.5 bg-white border rounded-lg px-3 py-2.5 shadow-sm transition-colors ${errors.password ? 'border-red-500 bg-red-50/50' : 'border-gray-200'}`}>
                <Lock className="w-4 h-4 text-[#0a7fd6]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className="w-full text-sm outline-none bg-transparent text-gray-800 placeholder-gray-300"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-medium pl-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0a7fd6] text-white py-3 rounded-lg font-bold text-sm shadow-md shadow-[#0a7fd6]/20 hover:bg-[#0a6ec2] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;