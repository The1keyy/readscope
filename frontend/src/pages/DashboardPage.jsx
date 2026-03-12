import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiClient } from '../services/apiClient';

export function DashboardPage() {
  const { token, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const client = apiClient(token);
        const sessionResponse = await client.get('/sessions/');
        if (cancelled) return;
        setSessions(sessionResponse.data);

        if (sessionResponse.data.length > 0) {
          const firstSession = sessionResponse.data[0];
          try {
            const analysisResponse = await client.get(`/analysis/${firstSession.id}`);
            if (!cancelled) {
              setLatestAnalysis({
                session: firstSession,
                result: analysisResponse.data,
              });
            }
          } catch {
            // If no analysis exists yet, keep the dashboard focused on starting one.
            if (!cancelled) {
              setLatestAnalysis(null);
            }
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const hasSessions = sessions.length > 0;

  return (
    <div className="rs-dashboard-page">
      <section className="rs-card rs-card--elevated rs-dashboard-hero">
        <div>
          <p className="rs-label">Dashboard</p>
          <h1 className="rs-dashboard-title">Welcome back, {user?.name}</h1>
          <p className="rs-text-muted">
            Create reading sessions, run analysis, and track how fluency and comprehension grow over time.
          </p>
        </div>
        <div className="rs-dashboard-actions">
          <Link
            to="/sessions/new"
            className="rs-button rs-button--primary"
          >
            New reading session
          </Link>
          {hasSessions && (
            <Link
              to={`/sessions[0].id}`}
              className="rs-button rs-button--ghost"
            >
              Open most recent
            </Link>
          )}
        </div>
      </section>

      <div className="rs-grid rs-grid--dashboard">
        <section className="rs-card rs-card--elevated">
          <div className="rs-section-header">
            <h3 className="rs-section-title">Recent sessions</h3>
            <span className="rs-badge">{sessions.length}</span>
          </div>

          {loading && <p className="rs-text-muted">Loading your sessions…</p>}

          {!loading && !hasSessions && (
            <p className="rs-text-muted">
              You haven&apos;t created any reading sessions yet. Start with a new passage to see your first results.
            </p>
          )}

          {!loading && hasSessions && (
            <ul className="rs-session-list">
              {sessions.slice(0, 5).map((session) => (
                <li
                  key={session.id}
                  className="rs-session-list-item"
                >
                  <div>
                    <Link
                      to={`/sessions/${session.id}`}
                      className="rs-session-title"
                    >
                      {session.title}
                    </Link>
                    <div className="rs-session-meta">
                      <span>{session.language}</span>
                      <span>•</span>
                      <span>{session.difficulty}</span>
                    </div>
                  </div>
                  <Link
                    to={`/sessions/${session.id}`}
                    className="rs-link"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rs-card rs-card--elevated">
          <div className="rs-section-header">
            <h3 className="rs-section-title">Latest analysis</h3>
          </div>

          {!latestAnalysis && (
            <p className="rs-text-muted">
              Once you run an analysis on a session, scores and feedback will show up here.
            </p>
          )}

          {latestAnalysis && (
            <div className="rs-analysis-summary">
              <div className="rs-analysis-summary-main">
                <p className="rs-label">Accuracy score</p>
                <p className="rs-score-large">{latestAnalysis.result.accuracy_score.toFixed(1)}%</p>
                <p className="rs-text-muted">
                  Session: <span className="rs-highlight">{latestAnalysis.session.title}</span>
                </p>
              </div>
              <div className="rs-analysis-summary-metrics">
                <div>
                  <p className="rs-label">Fluency</p>
                  <p className="rs-score-medium">{latestAnalysis.result.fluency_score.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="rs-label">Comprehension</p>
                  <p className="rs-score-medium">{latestAnalysis.result.comprehension_score.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="rs-label">Words</p>
                  <p className="rs-score-medium">{latestAnalysis.result.word_count}</p>
                </div>
              </div>
              <p className="rs-analysis-feedback">{latestAnalysis.result.feedback_summary}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

