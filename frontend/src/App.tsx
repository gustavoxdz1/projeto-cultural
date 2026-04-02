import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
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

export function App() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const hideGlobalHeader =
    location.pathname === '/' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/cadastro' ||
    location.pathname === '/esqueci-senha' ||
    location.pathname === '/recuperar-senha';

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
              <button className="ghost-button" onClick={logout} type="button">
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
          <Route path="/login" element={user ? <Navigate replace to="/perfil" /> : <LoginPage />} />
          <Route path="/cadastro" element={user ? <Navigate replace to="/perfil" /> : <SignupPage />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
          <Route path="/recuperar-senha" element={<ResetPasswordPage />} />
          <Route
            path="/portal"
            element={
              <ProtectedRoute redirectTo="/login">
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sugerir"
            element={
              <ProtectedRoute redirectTo="/login">
                <SuggestionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/locais/:id"
            element={
              <ProtectedRoute redirectTo="/login">
                <PlaceDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={user?.role === 'ADMIN' ? <Navigate replace to="/admin" /> : <LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly redirectTo="/admin/login">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute redirectTo="/login">
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
