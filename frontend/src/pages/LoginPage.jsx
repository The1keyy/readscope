import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiClient } from '../services/apiClient';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await apiClient().post('/auth/login', {
        email,
        password,
      });

      login(response.data.access_token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to sign in with those details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rs-auth-page">
      <div className="rs-auth-panel">
        <div className="rs-auth-header">
          <div className="rs-logo-mark" aria-hidden="true" />
          <div>
            <h1 className="rs-auth-title">Welcome back</h1>
            <p className="rs-auth-subtitle">Sign in to see your recent reading sessions and feedback.</p>
          </div>
        </div>

        <form
          className="rs-form"
          onSubmit={handleSubmit}
        >
          <label className="rs-field">
            <span className="rs-field-label">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              className="rs-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="rs-field">
            <span className="rs-field-label">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              className="rs-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <div className="rs-alert rs-alert--error">{error}</div>}

          <button
            type="submit"
            className="rs-button rs-button--primary rs-button--full"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="rs-auth-footer-text">
          New to ReadScope?{' '}
          <Link to="/register" className="rs-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

