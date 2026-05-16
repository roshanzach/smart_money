import { useState } from 'react';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.PROD ? 'https://smart-money-rbdu.onrender.com' : '';

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegistering ? `${API_URL}/api/auth/register` : `${API_URL}/api/auth/login`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('smartMoney_token', data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <div className="login-header">
          <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-muted">
            {isRegistering ? 'Sign up to manage your smart money' : 'Sign in to manage your smart money'}
          </p>
        </div>

        {error && <div className="budget-warning" style={{marginBottom: '1rem', padding: '0.75rem', animation: 'none'}}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group input-with-icon">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group input-with-icon">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
            {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="login-footer">
          <p className="text-muted">
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <a href="#" className="link" onClick={(e) => {
              e.preventDefault();
              setIsRegistering(!isRegistering);
              setError('');
            }}>
              {isRegistering ? 'Sign in' : 'Sign up'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
