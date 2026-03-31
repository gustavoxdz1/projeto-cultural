import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import { saveSession, type SessionUser } from '../services/session';

type SignupPageProps = {
  onAuth: (user: SessionUser) => void;
};

export function SignupPage({ onAuth }: SignupPageProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { auth } = await signup({
        name,
        email,
        password,
        receiveUpdates,
      });

      saveSession(auth);
      onAuth(auth.user);
      navigate('/perfil');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <div className="form-intro">
        <span className="eyebrow">Cadastro</span>
        <h1>Crie sua conta e participe do mapa cultural.</h1>
        <p>Você já sai com sessão iniciada e pode sugerir novos locais para ampliar o catálogo.</p>
      </div>

      <form className="card-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>

        <label>
          E-mail
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>

        <label>
          Senha
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        <label className="checkbox-field">
          <input
            checked={receiveUpdates}
            onChange={(event) => setReceiveUpdates(event.target.checked)}
            type="checkbox"
          />
          Quero receber novidades culturais por e-mail.
        </label>

        {error ? <p className="feedback error">{error}</p> : null}

        <button className="primary-button" disabled={loading} type="submit">
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </section>
  );
}
