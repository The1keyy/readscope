import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiClient } from '../services/apiClient';

export function NewSessionPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('English');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [sourceText, setSourceText] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const client = apiClient(token);
      const response = await client.post('/sessions/', {
        title,
        language,
        difficulty,
        source_text: sourceText,
        transcript_text: transcriptText || null,
      });

      navigate(`/sessions/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create that reading session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rs-page">
      <header className="rs-page-header">
        <div>
          <h1 className="rs-page-title">New reading session</h1>
          <p className="rs-text-muted">
            Add a passage and the reader&apos;s transcript. You can run analysis as soon as the transcript is ready.
          </p>
        </div>
      </header>

      <section className="rs-card rs-card--elevated">
        <form
          className="rs-form rs-form--two-column"
          onSubmit={handleSubmit}
        >
          <div className="rs-form-column">
            <label className="rs-field">
              <span className="rs-field-label">Title</span>
              <input
                type="text"
                required
                className="rs-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <div className="rs-field-row">
              <label className="rs-field rs-field--inline">
                <span className="rs-field-label">Language</span>
                <input
                  type="text"
                  required
                  className="rs-input"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                />
              </label>
              <label className="rs-field rs-field--inline">
                <span className="rs-field-label">Difficulty</span>
                <select
                  className="rs-input"
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>
            </div>

            <label className="rs-field rs-field--textarea">
              <span className="rs-field-label">Source text</span>
              <textarea
                required
                className="rs-input rs-input--textarea"
                rows={10}
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="Paste or type the passage the learner will read."
              />
            </label>
          </div>

          <div className="rs-form-column">
            <label className="rs-field rs-field--textarea">
              <span className="rs-field-label">Transcript text</span>
              <textarea
                className="rs-input rs-input--textarea"
                rows={14}
                value={transcriptText}
                onChange={(event) => setTranscriptText(event.target.value)}
                placeholder="Optional: paste the learner's spoken transcript when it's ready."
              />
            </label>

            {error && <div className="rs-alert rs-alert--error">{error}</div>}

            <div className="rs-form-actions">
              <button
                type="submit"
                className="rs-button rs-button--primary"
                disabled={submitting}
              >
                {submitting ? 'Creating session…' : 'Create session'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

