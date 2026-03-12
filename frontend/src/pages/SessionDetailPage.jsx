import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiClient } from '../services/apiClient';

export function SessionDetailPage() {
  const { sessionId } = useParams();
  const { token } = useAuth();

  const [session, setSession] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [runError, setRunError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      setLoadingSession(true);
      try {
        const client = apiClient(token);
        const response = await client.get(`/sessions/${sessionId}`);
        if (!cancelled) {
          setSession(response.data);
        }

        try {
          const analysisResponse = await client.get(`/analysis/${sessionId}`);
          if (!cancelled) {
            setAnalysis(analysisResponse.data);
          }
        } catch {
          if (!cancelled) {
            setAnalysis(null);
          }
        }
      } finally {
        if (!cancelled) {
          setLoadingSession(false);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [sessionId, token]);

  const handleRunAnalysis = async () => {
    setRunError('');
    setLoadingAnalysis(true);
    try {
      const client = apiClient(token);
      const response = await client.post(`/analysis/run/${sessionId}`);
      setAnalysis(response.data);
    } catch (err) {
      setRunError(err.response?.data?.detail || 'Analysis could not be completed for this session.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const canRunAnalysis = Boolean(session?.transcript_text);

  if (loadingSession) {
    return (
      <div className="rs-page">
        <div className="rs-card rs-card--elevated">
          <p className="rs-text-muted">Loading session details…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rs-page">
        <div className="rs-card rs-card--elevated">
          <p className="rs-text-muted">That reading session could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rs-page rs-page--split">
      <section className="rs-card rs-card--elevated rs-reading-column">
        <header className="rs-page-header">
          <div>
            <h1 className="rs-page-title">{session.title}</h1>
            <p className="rs-text-muted">
              {session.language} • {session.difficulty}
            </p>
          </div>
        </header>

        <div className="rs-reading-block">
          <h2 className="rs-subheading">Source text</h2>
          <p className="rs-reading-text">{session.source_text}</p>
        </div>

        <div className="rs-reading-block">
          <h2 className="rs-subheading">Transcript text</h2>
          {session.transcript_text ? (
            <p className="rs-reading-text rs-reading-text--muted">{session.transcript_text}</p>
          ) : (
            <p className="rs-text-muted">
              This session doesn&apos;t have a transcript yet. Add the transcript via the backend or by updating the
              session, then run analysis here.
            </p>
          )}
        </div>
      </section>

      <aside className="rs-card rs-card--elevated rs-analysis-column">
        <div className="rs-section-header">
          <h2 className="rs-section-title">Analysis</h2>
        </div>

        <p className="rs-text-muted">
          Run analysis to see accuracy, fluency, and comprehension scores for this reading.
        </p>

        <button
          type="button"
          className="rs-button rs-button--primary rs-button--full"
          onClick={handleRunAnalysis}
          disabled={!canRunAnalysis || loadingAnalysis}
        >
          {loadingAnalysis ? 'Running analysis…' : 'Run analysis'}
        </button>

        {!canRunAnalysis && (
          <p className="rs-helper-text">
            Add a transcript for this session before running analysis. The service compares it to the source text.
          </p>
        )}

        {runError && <div className="rs-alert rs-alert--error rs-alert--spaced">{runError}</div>}

        {analysis && (
          <div className="rs-analysis-panel">
            <div className="rs-analysis-score-main">
              <p className="rs-label">Accuracy score</p>
              <p className="rs-score-large rs-score-large--accent">{analysis.accuracy_score.toFixed(1)}%</p>
            </div>

            <div className="rs-analysis-score-grid">
              <div>
                <p className="rs-label">Fluency</p>
                <p className="rs-score-medium">{analysis.fluency_score.toFixed(1)}%</p>
              </div>
              <div>
                <p className="rs-label">Comprehension</p>
                <p className="rs-score-medium">{analysis.comprehension_score.toFixed(1)}%</p>
              </div>
              <div>
                <p className="rs-label">Word count</p>
                <p className="rs-score-medium">{analysis.word_count}</p>
              </div>
            </div>

            <div className="rs-analysis-feedback-block">
              <p className="rs-label">Feedback</p>
              <p className="rs-analysis-feedback">{analysis.feedback_summary}</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

