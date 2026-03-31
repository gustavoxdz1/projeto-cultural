import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await forgotPassword({ email });
      setMessage(response.message);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível solicitar a recuperação de senha.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-support-page">
      <div className="auth-support-card">
        <span className="eyebrow">Recuperação</span>
        <h1>Esqueceu sua senha?</h1>
        <p>Informe seu e-mail para receber o link de redefinição de senha.</p>

        <form className="auth-support-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          {message ? <p className="feedback success">{message}</p> : null}
          {error ? <p className="feedback error">{error}</p> : null}

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>

        <Link className="inline-link" to="/login">
          Voltar para o login
        </Link>
      </div>
    </section>
  );
}
