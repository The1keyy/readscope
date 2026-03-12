import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="rs-app-shell">
      <header className="rs-header">
        <div className="rs-header-left">
          <div
            className="rs-logo-mark"
            aria-hidden="true"
          />
          <div>
            <div className="rs-app-name">ReadScope</div>
            <div className="rs-app-tagline">Reading fluency insights, made clear.</div>
          </div>
        </div>
        <nav className="rs-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'rs-nav-link rs-nav-link--active' : 'rs-nav-link')}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/sessions/new"
            className={({ isActive }) => (isActive ? 'rs-nav-link rs-nav-link--active' : 'rs-nav-link')}
          >
            Reading Sessions
          </NavLink>
        </nav>
        <div className="rs-header-right">
          {user && (
            <div className="rs-header-profile">
              <span className="rs-header-user-initials">{user.name?.[0]?.toUpperCase() || 'R'}</span>
              <div className="rs-header-user-meta">
                <span className="rs-header-user-name">{user.name}</span>
                <span className="rs-header-user-email">{user.email}</span>
              </div>
            </div>
          )}
          <button
            type="button"
            className="rs-button rs-button--ghost"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="rs-main">
        <Outlet />
      </main>
    </div>
  );
}

