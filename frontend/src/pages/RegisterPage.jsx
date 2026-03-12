import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiClient } from '../services/apiClient';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await apiClient().post('/auth/register', {
        name,
        email,
        password,
      });

      // After a successful sign-up, log the user in so they land on a working dashboard right away.
      const loginResponse = await apiClient().post('/auth/login', {
        email,
        password,
      });

      login(loginResponse.data.access_token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create an account with those details.');
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
            <h1 className="rs-auth-title">Create your ReadScope account</h1>
            <p className="rs-auth-subtitle">Set up an account to track reading sessions over time.</p>
          </div>
        </div>

        <form
          className="rs-form"
          onSubmit={handleSubmit}
        >
          <label className="rs-field">
            <span className="rs-field-label">Name</span>
            <input
              type="text"
              required
              className="rs-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

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
              autoComplete="new-password"
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
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="rs-auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="rs-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

