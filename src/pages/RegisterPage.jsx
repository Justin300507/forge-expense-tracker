import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import API from '../api';
import { parseError, sleep } from '../utils/helpers';

const RegisterPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        setStatus(attempt === 1 ? 'Creating account...' : `Backend starting up... retrying (${attempt}/3)`);
        // Step 1: create account
        await API.post('/auth/register', { email, password });

        // Step 2: immediately log in
        setStatus('Account created. Signing in...');
        const loginRes = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', loginRes.data.access_token);
        if (loginRes.data.display_name) localStorage.setItem('display_name', loginRes.data.display_name);
        if (loginRes.data.user_id) localStorage.setItem('user_id', String(loginRes.data.user_id));
        if (loginRes.data.email) localStorage.setItem('user_email', loginRes.data.email);
        navigate('/dashboard');
        return;
      } catch (err) {
        const msg = parseError(err);
        if (msg) { setError(msg); setStatus(null); setLoading(false); return; } // real API error, don't retry
        if (attempt < 3) { setStatus(`Backend starting up... retrying in 15s (${attempt}/3)`); await sleep(15000); }
      }
    }
    setError('Backend took too long. Wait 30 seconds then try again.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <AuthForm
        type="register"
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        status={status}
      />
    </div>
  );
};

export default RegisterPage;
