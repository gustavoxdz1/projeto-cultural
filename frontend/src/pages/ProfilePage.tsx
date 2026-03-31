import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, updatePreferences } from '../services/api';
import { getStoredSession, saveSession, type SessionUser } from '../services/session';
import type { Profile } from '../types/api';

type ProfilePageProps = {
  user: SessionUser;
  onAuth: (user: SessionUser) => void;
};

export function ProfilePage({ user, onAuth }: ProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const joinedDate = useMemo(() => {
    if (!profile) {
      return '';
    }

    return new Date(profile.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, [profile]);

  const accountAgeLabel = useMemo(() => {
    if (!profile) {
      return '';
    }

    const createdAt = new Date(profile.createdAt);
    const now = new Date();
    const diffDays = Math.max(1, Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));

    if (diffDays < 30) {
      return `${diffDays} dia(s) de uso`;
    }

    const diffMonths = Math.max(1, Math.floor(diffDays / 30));
    return `${diffMonths} mes(es) de uso`;
  }, [profile]);

  const userInitials = useMemo(() => {
    return user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase() ?? '')
      .join('');
  }, [user.name]);

  useEffect(() => {
    const session = getStoredSession();

    if (!session) {
      setLoading(false);
      return;
    }

    getProfile(session.token)
      .then(setProfile)
      .catch(() => setError('Não foi possível carregar seu perfil.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(receiveUpdates: boolean) {
    const session = getStoredSession();

    if (!session) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await updatePreferences(session.token, { receiveUpdates });
      const nextUser = { ...user, receiveUpdates: updated.receiveUpdates };

      saveSession({
        token: session.token,
        user: nextUser,
      });

      setProfile(updated);
      onAuth(nextUser);
    } catch {
      setError('Não foi possível atualizar sua preferência agora.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="profile-layout">
      <aside className="profile-sidebar">
        <div className="profile-card profile-hero-card">
          <span className="eyebrow">Perfil</span>
          <div className="profile-avatar">{userInitials}</div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <strong>{user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</strong>
        </div>

        <div className="profile-card profile-summary-card">
          <h2>Resumo da conta</h2>
          <div className="profile-stat-list">
            <div className="profile-stat-item">
              <span>Status</span>
              <strong>Ativa</strong>
            </div>
            <div className="profile-stat-item">
              <span>Função</span>
              <strong>{user.role === 'ADMIN' ? 'Gestão administrativa' : 'Consulta e colaboração'}</strong>
            </div>
            <div className="profile-stat-item">
              <span>Cadastro</span>
              <strong>{loading || !profile ? 'Carregando...' : joinedDate}</strong>
            </div>
            <div className="profile-stat-item">
              <span>Histórico</span>
              <strong>{loading || !profile ? 'Carregando...' : accountAgeLabel}</strong>
            </div>
          </div>
        </div>
      </aside>

      <div className="profile-content">
        <div className="profile-card">
          {loading ? <p className="feedback">Carregando perfil...</p> : null}
          {error ? <p className="feedback error">{error}</p> : null}

          {profile ? (
            <>
              <span className="eyebrow">Preferências</span>
              <h2>Comunicação e notificações</h2>
              <p>
                Defina como a SpotTech pode entrar em contato com você e acompanhar atualizações
                da plataforma.
              </p>

              <label className="checkbox-field">
                <input
                  checked={profile.receiveUpdates}
                  disabled={saving}
                  onChange={(event) => handleToggle(event.target.checked)}
                  type="checkbox"
                />
                Receber atualizações por e-mail
              </label>

              <div className="profile-chip-row">
                <span className={`profile-chip ${profile.receiveUpdates ? 'active' : ''}`}>
                  {profile.receiveUpdates ? 'Notificações ativas' : 'Notificações pausadas'}
                </span>
                <span className="profile-chip">{user.role === 'ADMIN' ? 'Acesso administrativo' : 'Conta padrão'}</span>
              </div>
            </>
          ) : null}
        </div>

        <div className="profile-card">
          <span className="eyebrow">Acesso rápido</span>
          <h2>O que você pode fazer agora</h2>
          <div className="profile-action-grid">
            <Link className="profile-action-card" to="/portal">
              <strong>Explorar locais</strong>
              <p>Navegue pelo catálogo e encontre espaços com mais rapidez.</p>
            </Link>
            <Link className="profile-action-card" to="/sugerir">
              <strong>Sugerir novo local</strong>
              <p>Envie novas sugestões para ampliar a base publicada.</p>
            </Link>
            {user.role === 'ADMIN' ? (
              <Link className="profile-action-card" to="/admin">
                <strong>Abrir painel admin</strong>
                <p>Gerencie sugestões, categorias e locais em um único espaço.</p>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="profile-card">
          <span className="eyebrow">Orientações</span>
          <h2>Como aproveitar melhor o portal</h2>
          <div className="profile-guidance-list">
            <div className="profile-guidance-item">
              <strong>Atualize suas preferências</strong>
              <p>Mantenha o recebimento de novidades ativo para acompanhar mudanças do portal.</p>
            </div>
            <div className="profile-guidance-item">
              <strong>Use o catálogo com filtros</strong>
              <p>Busque por categoria e bairro para chegar mais rápido ao local desejado.</p>
            </div>
            <div className="profile-guidance-item">
              <strong>Colabore com novas sugestões</strong>
              <p>Quanto mais sugestões qualificadas, mais rica e atualizada fica a plataforma.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
