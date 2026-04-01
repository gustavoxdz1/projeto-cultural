import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SuggestionPage } from './pages/SuggestionPage';
import { ProfilePage } from './pages/ProfilePage';
import { PlaceDetailsPage } from './pages/PlaceDetailsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { getStoredSession, clearSession, type SessionUser } from './services/session';

export function App() {
  const location = useLocation();
  const [user, setUser] = useState<SessionUser | null>(null);
  const hideGlobalHeader =
    location.pathname === '/' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/cadastro' ||
    location.pathname === '/esqueci-senha' ||
    location.pathname === '/recuperar-senha';

  useEffect(() => {
    const session = getStoredSession();
    setUser(session?.user ?? null);
  }, []);

  function handleAuth(userData: SessionUser) {
    setUser(userData);
  }

  function handleLogout() {
    clearSession();
    setUser(null);
  }

  return (
    <div className="shell">
      {!hideGlobalHeader ? (
        <header className="topbar">
          <Link className="brand" to="/">
            <img
              alt="SpotTech"
              className="brand-mark-image"
              src="/images/branding/spottech-logo.png"
            />
            <div>
              <strong>SpotTech</strong>
              <p>Plataforma de descoberta e gestão de locais</p>
            </div>
          </Link>

          <nav className="nav">
            <Link to="/portal">Explorar</Link>
            <Link to="/sugerir">Sugerir local</Link>
            <Link to="/perfil">Meu perfil</Link>
            {user?.role === 'ADMIN' ? <Link to="/admin">Admin</Link> : null}
            {user ? (
              <button className="ghost-button" onClick={handleLogout} type="button">
                Sair
              </button>
            ) : null}
          </nav>
        </header>
      ) : null}

      <main>
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
          <Route path="/cadastro" element={<SignupPage onAuth={handleAuth} />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
          <Route path="/recuperar-senha" element={<ResetPasswordPage />} />
          <Route path="/portal" element={user ? <HomePage /> : <Navigate replace to="/" />} />
          <Route path="/sugerir" element={user ? <SuggestionPage /> : <Navigate replace to="/" />} />
          <Route path="/locais/:id" element={user ? <PlaceDetailsPage /> : <Navigate replace to="/" />} />
          <Route path="/admin/login" element={<LoginPage onAuth={handleAuth} />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route
            path="/perfil"
            element={user ? <ProfilePage user={user} onAuth={handleAuth} /> : <Navigate replace to="/" />}
          />
        </Routes>
      </main>
    </div>
  );
}
