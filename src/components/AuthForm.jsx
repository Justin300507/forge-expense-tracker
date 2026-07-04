import React from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const AuthForm = ({ type, email, setEmail, password, setPassword, onSubmit, loading, error, status }) => {
  const isRegister = type === 'register';

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto mb-3 flex items-center justify-center">
          <span className="text-white font-bold text-xl">E</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isRegister ? 'Create an account' : 'Welcome back'}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{isRegister ? 'Sign up to get started' : 'Sign in to your account'}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
            disabled={loading}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-medium text-slate-700 dark:text-slate-300">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input"
            disabled={loading}
          />
          {isRegister && <p className="text-xs text-slate-400">Must be at least 8 characters</p>}
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {status && <p className="text-sm text-emerald-600 text-center">{status}</p>}
        <button
          type="submit"
          onClick={onSubmit}
          className="btn-primary w-full justify-center"
          disabled={loading || !email || !password || (isRegister && password.length < 8)}
        >
          {loading ? <LoadingSpinner /> : (isRegister ? 'Sign Up' : 'Sign In')}
        </button>
      </div>
      <p className="text-center text-sm text-slate-500 mt-4">
        {isRegister ? (
          <>Already have an account? <Link to="/login" className="text-emerald-600 font-medium hover:underline">Sign in</Link></>
        ) : (
          <>Don't have an account? <Link to="/register" className="text-emerald-600 font-medium hover:underline">Sign up</Link></>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
