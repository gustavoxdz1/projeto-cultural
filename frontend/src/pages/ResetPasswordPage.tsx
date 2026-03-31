import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/api';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setError('Token de recuperação não encontrado.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await resetPassword({ token, password });
      setMessage(response.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível redefinir a senha.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-support-page">
      <div className="auth-support-card">
        <span className="eyebrow">Nova senha</span>
        <h1>Redefinir senha</h1>
        <p>Digite sua nova senha para concluir a recuperação da conta.</p>

        <form className="auth-support-form" onSubmit={handleSubmit}>
          <label>
            Nova senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          <label>
            Confirmar nova senha
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          {message ? <p className="feedback success">{message}</p> : null}
          {error ? <p className="feedback error">{error}</p> : null}

          <button className="primary-button" disabled={loading || !token} type="submit">
            {loading ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>

        <Link className="inline-link" to="/login">
          Voltar para o login
        </Link>
      </div>
    </section>
  );
}
