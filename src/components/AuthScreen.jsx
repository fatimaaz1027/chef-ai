import React, { useState } from 'react';
import { Mail, Lock, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleNotice, setGoogleNotice] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGoogleNotice('');
    setResetSuccess('');

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signup(cleanEmail, password);
      } else {
        await login(cleanEmail, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setGoogleNotice('');
    setResetSuccess('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setGoogleNotice('');
    setResetSuccess('');

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your email address to reset password.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(cleanEmail);
      setResetSuccess(`Password reset link sent to ${cleanEmail}. Check your inbox!`);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setError('');
    setGoogleNotice('');
    setResetSuccess('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Auth Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-slate-700/80 transition-colors relative z-10 fade-up">
        {/* Header & Logo */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-3xl shadow-sm mb-1">
            🧑‍🍳
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center justify-center gap-1.5">
            ChefAI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {isSignUp
              ? 'Create your account to start cooking'
              : 'Welcome back! Sign in to continue'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Reset Success Alert */}
        {resetSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {/* Google Notice Alert */}
        {googleNotice && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>{googleNotice}</span>
          </div>
        )}

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-3 px-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/60 hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 min-h-[46px] shadow-xs active:scale-[0.99]"
        >
          {/* Official Google SVG Logo */}
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-gray-200 dark:border-slate-700" />
          <span className="absolute bg-white dark:bg-slate-800 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            or
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 font-medium transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                  setResetSuccess('');
                }}
                placeholder="Enter your password (min. 6 chars)"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 font-medium transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[46px] shadow-md hover:shadow-lg mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            )}
          </button>
        </form>

        {/* Footer Toggle Link */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700/80 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 ml-1"
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
