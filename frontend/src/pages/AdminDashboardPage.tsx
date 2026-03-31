import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  createCategory,
  createPlace,
  getAdminSuggestions,
  getCategories,
  getPlaces,
  updatePlace,
  updateSuggestionStatus,
} from '../services/api';
import { getStoredSession } from '../services/session';
import type { Category, Place, Suggestion } from '../types/api';

export function AdminDashboardPage() {
  const session = getStoredSession();
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [placeForm, setPlaceForm] = useState({
    name: '',
    description: '',
    address: '',
    neighborhood: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
    categoryId: '',
  });
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [busySuggestionId, setBusySuggestionId] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingPlace, setSavingPlace] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadDashboardData() {
    if (!session?.token) {
      return;
    }

    const [placesData, categoriesData, suggestionsData] = await Promise.all([
      getPlaces(),
      getCategories(),
      getAdminSuggestions(session.token),
    ]);

    setPlaces(placesData);
    setCategories(categoriesData);
    setSuggestions(suggestionsData);
  }

  useEffect(() => {
    if (!session?.token) {
      return;
    }

    loadDashboardData().catch(() => {
      setError('Não foi possível carregar os dados do painel.');
    });
  }, [session?.token]);

  if (!session) {
    return <Navigate replace to="/admin/login" />;
  }

  if (session.user.role !== 'ADMIN') {
    return <Navigate replace to="/" />;
  }

  const token = session.token;

  const pendingSuggestions = suggestions.filter((item) => item.status === 'PENDING');

  async function handleSuggestionStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    setBusySuggestionId(id);
    setError(null);
    setNotice(null);

    try {
      const response = await updateSuggestionStatus(token, id, { status });
      await loadDashboardData();

      setNotice(
        status === 'APPROVED'
          ? response.place
            ? 'Sugestão aprovada e local criado automaticamente.'
            : 'Sugestão aprovada com sucesso.'
          : 'Sugestão rejeitada com sucesso.',
      );
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível atualizar a sugestão.');
    } finally {
      setBusySuggestionId(null);
    }
  }

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCategory(true);
    setError(null);
    setNotice(null);

    try {
      const category = await createCategory(token, { name: categoryName });
      setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)));
      setCategoryName('');
      setPlaceForm((current) => ({
        ...current,
        categoryId: current.categoryId || category.id,
      }));
      setNotice('Categoria criada com sucesso.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível criar a categoria.');
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleCreatePlace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPlace(true);
    setError(null);
    setNotice(null);

    try {
      const payload = {
        name: placeForm.name,
        description: placeForm.description,
        address: placeForm.address,
        neighborhood: placeForm.neighborhood,
        latitude: placeForm.latitude ? Number(placeForm.latitude) : undefined,
        longitude: placeForm.longitude ? Number(placeForm.longitude) : undefined,
        imageUrl: placeForm.imageUrl || undefined,
        categoryId: placeForm.categoryId,
      };

      const saved = editingPlaceId
        ? await updatePlace(token, editingPlaceId, payload)
        : await createPlace(token, payload);

      const category = categories.find((item) => item.id === saved.categoryId);

      setPlaces((current) => {
        const nextPlace = {
          ...saved,
          category: category ?? saved.category,
        };

        if (editingPlaceId) {
          return current.map((item) => (item.id === editingPlaceId ? nextPlace : item));
        }

        return [...current, nextPlace];
      });

      setPlaceForm({
        name: '',
        description: '',
        address: '',
        neighborhood: '',
        latitude: '',
        longitude: '',
        imageUrl: '',
        categoryId: '',
      });
      setEditingPlaceId(null);
      setNotice(editingPlaceId ? 'Local atualizado com sucesso.' : 'Local cadastrado com sucesso.');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : editingPlaceId
            ? 'Não foi possível atualizar o local.'
            : 'Não foi possível cadastrar o local.',
      );
    } finally {
      setSavingPlace(false);
    }
  }

  function handleEditPlace(place: Place) {
    setEditingPlaceId(place.id);
    setPlaceForm({
      name: place.name,
      description: place.description,
      address: place.address,
      neighborhood: place.neighborhood,
      latitude: place.latitude?.toString() ?? '',
      longitude: place.longitude?.toString() ?? '',
      imageUrl: place.imageUrl ?? '',
      categoryId: place.categoryId,
    });
    setNotice(null);
    setError(null);
  }

  function handleCancelEdit() {
    setEditingPlaceId(null);
    setPlaceForm({
      name: '',
      description: '',
      address: '',
      neighborhood: '',
      latitude: '',
      longitude: '',
      imageUrl: '',
      categoryId: '',
    });
  }

  return (
    <section className="admin-dashboard-page">
      <article className="admin-dashboard-surface">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-hero">
            <div className="portal-brand">
              <span className="portal-brand-mark admin" />
              <div>
                <strong>SpotTech Admin</strong>
                <p>Visão geral da plataforma e das operações de curadoria</p>
              </div>
            </div>

            <div className="admin-dashboard-copy">
              <span className="eyebrow light">Overview</span>
              <h1>Controle sugestões, edições e organização da base em um único painel.</h1>
              <p>
                A área administrativa foi desenhada para centralizar decisões operacionais, manter
                a qualidade do conteúdo e permitir evolução contínua do catálogo publicado.
              </p>
            </div>
          </div>
        </header>

        <section className="admin-stats-grid">
          <div className="admin-stat-card cyan">
            <span>Locais Culturais</span>
            <strong>{places.length}</strong>
          </div>
          <div className="admin-stat-card orange">
            <span>Categorias</span>
            <strong>{categories.length}</strong>
          </div>
          <div className="admin-stat-card purple">
            <span>Sugestões</span>
            <strong>{suggestions.length}</strong>
          </div>
          <div className="admin-stat-card green">
            <span>Pendentes</span>
            <strong>{pendingSuggestions.length}</strong>
          </div>
        </section>

        {error ? <p className="feedback error dashboard-feedback">{error}</p> : null}
        {notice ? <p className="feedback success dashboard-feedback">{notice}</p> : null}

        <section className="admin-dashboard-grid admin-dashboard-grid-wide">
          <div className="admin-panel">
            <h2>Sugestões pendentes</h2>
            <div className="admin-feed">
              {pendingSuggestions.length > 0 ? (
                pendingSuggestions.map((suggestion) => (
                  <article className="suggestion-review-card" key={suggestion.id}>
                    <div className="suggestion-review-header">
                      <div>
                        <strong>{suggestion.name}</strong>
                        <p>{suggestion.categoryName}</p>
                      </div>
                      <div className="status-pill pending">PENDING</div>
                    </div>

                    <p>{suggestion.description || suggestion.address}</p>
                    <small>
                      {suggestion.neighborhood} · {suggestion.address}
                    </small>
                    <small>
                      Coordenadas:{' '}
                      {suggestion.latitude != null && suggestion.longitude != null
                        ? `${suggestion.latitude}, ${suggestion.longitude}`
                        : 'não informadas'}
                    </small>

                    <div className="suggestion-actions">
                      <button
                        className="action-button approve"
                        disabled={busySuggestionId === suggestion.id}
                        onClick={() => handleSuggestionStatus(suggestion.id, 'APPROVED')}
                        type="button"
                      >
                        Aprovar
                      </button>
                      <button
                        className="action-button reject"
                        disabled={busySuggestionId === suggestion.id}
                        onClick={() => handleSuggestionStatus(suggestion.id, 'REJECTED')}
                        type="button"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="feedback">Nenhuma sugestão pendente no momento.</p>
              )}
            </div>
          </div>

          <div className="admin-panel">
            <h2>Cadastrar categoria</h2>
            <form className="admin-form" onSubmit={handleCreateCategory}>
              <label>
                Nome da categoria
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  required
                />
              </label>

              <button className="portal-primary-button" disabled={savingCategory} type="submit">
                {savingCategory ? 'Salvando...' : 'Criar categoria'}
              </button>
            </form>

            <div className="admin-mini-list">
              {categories.map((category) => (
                <div className="admin-mini-item" key={category.id}>
                  <strong>{category.name}</strong>
                  <small>{category.slug}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-heading">
              <h2>{editingPlaceId ? 'Editar local' : 'Cadastrar local'}</h2>
              {editingPlaceId ? (
                <button className="ghost-button admin-inline-button" onClick={handleCancelEdit} type="button">
                  Cancelar
                </button>
              ) : null}
            </div>
            <form className="admin-form admin-form-grid" onSubmit={handleCreatePlace}>
              <label>
                Nome
                <input
                  value={placeForm.name}
                  onChange={(event) => setPlaceForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>

              <label>
                Categoria
                <select
                  value={placeForm.categoryId}
                  onChange={(event) => setPlaceForm((current) => ({ ...current, categoryId: event.target.value }))}
                  required
                >
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="span-2">
                Endereço
                <input
                  value={placeForm.address}
                  onChange={(event) => setPlaceForm((current) => ({ ...current, address: event.target.value }))}
                  required
                />
              </label>

              <label>
                Bairro
                <input
                  value={placeForm.neighborhood}
                  onChange={(event) => setPlaceForm((current) => ({ ...current, neighborhood: event.target.value }))}
                  required
                />
              </label>

              <label>
                URL da imagem
                <input
                  value={placeForm.imageUrl}
                  onChange={(event) => setPlaceForm((current) => ({ ...current, imageUrl: event.target.value }))}
                />
              </label>

              <label>
                Latitude
                <input
                  step="any"
                  type="number"
                  value={placeForm.latitude}
                  onChange={(event) => setPlaceForm((current) => ({ ...current, latitude: event.target.value }))}
                />
              </label>

              <label>
                Longitude
                <input
                  step="any"
                  type="number"
                  value={placeForm.longitude}
                  onChange={(event) => setPlaceForm((current) => ({ ...current, longitude: event.target.value }))}
                />
              </label>

              <label className="span-2">
                Descrição
                <textarea
                  rows={4}
                  value={placeForm.description}
                  onChange={(event) => setPlaceForm((current) => ({ ...current, description: event.target.value }))}
                  required
                />
              </label>

              <button className="portal-primary-button span-2" disabled={savingPlace} type="submit">
                {savingPlace ? 'Salvando...' : editingPlaceId ? 'Salvar alterações' : 'Cadastrar local'}
              </button>
            </form>
          </div>

          <div className="admin-panel">
            <h2>Locais recentes</h2>
            <div className="admin-list">
              {places.slice(0, 8).map((place) => (
                <div className="admin-list-item" key={place.id}>
                  <span className="color-dot" />
                  <div>
                    <strong>{place.name}</strong>
                    <p>{place.category.name}</p>
                  </div>
                  <div className="admin-list-actions">
                    <small>{place.neighborhood}</small>
                    <button className="admin-edit-button" onClick={() => handleEditPlace(place)} type="button">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </section>
  );
}
