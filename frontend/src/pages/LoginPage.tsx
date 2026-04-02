import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/api';

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAdminLogin = location.pathname.startsWith('/admin');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });

      if (isAdminLogin && response.user.role !== 'ADMIN') {
        setError('Esta conta não possui acesso administrativo.');
        return;
      }

      setAuthSession(response);
      navigate(isAdminLogin ? '/admin' : '/perfil');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-login-page">
      <div className="admin-login-shell">
        <div className="admin-login-stage">
          <span className="eyebrow light">{isAdminLogin ? 'Admin access' : 'User access'}</span>
          <h1>{isAdminLogin ? 'Gerencie a operação da SpotTech com controle total.' : 'Acesse sua conta e continue sua navegação na SpotTech.'}</h1>
          <p>
            {isAdminLogin
              ? 'O ambiente administrativo permite validar sugestões, editar locais, criar categorias e manter a plataforma organizada com segurança.'
              : 'O ambiente autenticado permite explorar locais, consultar detalhes, acompanhar o portal e contribuir com novas sugestões.'}
          </p>

          <div className="admin-login-stage-card">
            <strong>{isAdminLogin ? 'Área restrita' : 'Conta autenticada'}</strong>
            <p>
              {isAdminLogin
                ? 'Apenas perfis com permissão administrativa podem concluir este acesso.'
                : 'Entre com seus dados para liberar o catálogo, o perfil e o envio de sugestões.'}
            </p>
          </div>
        </div>

        <div className="admin-login-card">
          <div className="admin-login-intro">
            <span className="eyebrow">{isAdminLogin ? 'Sign in' : 'Welcome back'}</span>
            <h2>{isAdminLogin ? 'Painel administrativo' : 'Entrar na plataforma'}</h2>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label>
              E-mail
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>

            <label>
              Senha
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>

            {error ? <p className="feedback error">{error}</p> : null}

            <button className="portal-primary-button full-width-button" disabled={loading} type="submit">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <Link className="admin-login-link" to="/esqueci-senha">
              Esqueceu sua senha?
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
