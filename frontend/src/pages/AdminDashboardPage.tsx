import { useEffect, useState } from 'react';
import { AdminCategoryPanel } from '../components/admin/AdminCategoryPanel';
import { AdminPlaceFormPanel } from '../components/admin/AdminPlaceFormPanel';
import { AdminRecentPlacesPanel } from '../components/admin/AdminRecentPlacesPanel';
import { AdminSuggestionsPanel } from '../components/admin/AdminSuggestionsPanel';
import { INITIAL_ADMIN_PLACE_FORM, type AdminPlaceFormState } from '../components/admin/types';
import { useAuth } from '../contexts/AuthContext';
import {
  createCategory,
  createPlace,
  deleteCategory,
  deletePlace,
  getAdminSuggestions,
  getCategories,
  getPlaces,
  updatePlace,
  updateSuggestionStatus,
} from '../services/api';
import type { Category, Place, Suggestion } from '../types/api';
import { getUserInitials } from '../utils/user';

export function AdminDashboardPage() {
  const { session } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [placeForm, setPlaceForm] = useState<AdminPlaceFormState>(INITIAL_ADMIN_PLACE_FORM);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [busySuggestionId, setBusySuggestionId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingPlaceId, setDeletingPlaceId] = useState<string | null>(null);
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

  if (!session?.token) {
    return null;
  }

  const token = session.token;
  const adminInitials = getUserInitials(session.user.name);
  const pendingSuggestions = suggestions.filter((item) => item.status === 'PENDING');

  function updatePlaceFormField<K extends keyof AdminPlaceFormState>(field: K, value: AdminPlaceFormState[K]) {
    setPlaceForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

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

      setPlaceForm(INITIAL_ADMIN_PLACE_FORM);
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
    setPlaceForm(INITIAL_ADMIN_PLACE_FORM);
  }

  function handleDeleteCurrentPlace() {
    if (!editingPlaceId) {
      return;
    }

    const currentPlace = places.find((item) => item.id === editingPlaceId);

    if (!currentPlace) {
      return;
    }

    void handleDeletePlace(currentPlace);
  }

  async function handleDeleteCategory(category: Category) {
    const confirmed = window.confirm(`Deseja realmente excluir a categoria "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingCategoryId(category.id);
    setError(null);
    setNotice(null);

    try {
      await deleteCategory(token, category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      setPlaceForm((current) =>
        current.categoryId === category.id
          ? {
              ...current,
              categoryId: '',
            }
          : current,
      );
      setNotice('Categoria excluída com sucesso.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível excluir a categoria.');
    } finally {
      setDeletingCategoryId(null);
    }
  }

  async function handleDeletePlace(place: Place) {
    const confirmed = window.confirm(`Deseja realmente excluir o local "${place.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingPlaceId(place.id);
    setError(null);
    setNotice(null);

    try {
      await deletePlace(token, place.id);
      setPlaces((current) => current.filter((item) => item.id !== place.id));

      if (editingPlaceId === place.id) {
        handleCancelEdit();
      }

      setNotice('Local excluído com sucesso.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível excluir o local.');
    } finally {
      setDeletingPlaceId(null);
    }
  }

  return (
    <section className="admin-dashboard-page">
      <article className="admin-dashboard-surface">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-topbar">
            <div className="admin-dashboard-brand">
              <img
                alt="SpotTech"
                className="admin-dashboard-logo"
                src="/images/branding/spottech-logo.png"
              />
              <div>
                <span className="eyebrow light">Painel administrativo</span>
                <strong>SpotTech Admin</strong>
                <p>Curadoria, revisão e gestão da base oficial de locais.</p>
              </div>
            </div>

            <div className="admin-dashboard-user-card">
              <div className="admin-dashboard-user-copy">
                <span>Operador ativo</span>
                <strong>{session.user.name}</strong>
                <small>{session.user.email}</small>
              </div>
              <div className="admin-dashboard-avatar" aria-hidden="true">
                {adminInitials}
              </div>
            </div>
          </div>

          <div className="admin-dashboard-hero">
            <div className="admin-dashboard-copy">
              <span className="eyebrow light">Visão geral</span>
              <h1>Coordene sugestões, categorias e locais em um fluxo mais claro e controlado.</h1>
              <p>
                Use este painel para revisar contribuições da comunidade, manter o catálogo consistente
                e publicar atualizações com mais segurança operacional.
              </p>
            </div>

            <aside className="admin-dashboard-summary-card">
              <div className="admin-dashboard-badge-row">
                <span className="admin-dashboard-badge">Acesso administrativo</span>
                <span className="admin-dashboard-badge muted">
                  {pendingSuggestions.length} pendente{pendingSuggestions.length === 1 ? '' : 's'}
                </span>
              </div>

              <p className="admin-dashboard-summary-text">
                A sessão atual está preparada para aprovar sugestões, organizar categorias e atualizar
                locais já publicados sem perder visibilidade do que exige atenção imediata.
              </p>

              <div className="admin-dashboard-summary-metrics">
                <div>
                  <span>Itens publicados</span>
                  <strong>{places.length}</strong>
                </div>
                <div>
                  <span>Equipe ativa</span>
                  <strong>1 admin</strong>
                </div>
              </div>
            </aside>
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
          <AdminSuggestionsPanel
            busySuggestionId={busySuggestionId}
            onSuggestionStatus={handleSuggestionStatus}
            suggestions={pendingSuggestions}
          />
          <AdminCategoryPanel
            categories={categories}
            categoryName={categoryName}
            deletingCategoryId={deletingCategoryId}
            onDeleteCategory={handleDeleteCategory}
            onCategoryNameChange={setCategoryName}
            onSubmit={handleCreateCategory}
            savingCategory={savingCategory}
          />
          <AdminPlaceFormPanel
            categories={categories}
            deletingPlaceId={deletingPlaceId}
            editingPlaceId={editingPlaceId}
            onCancelEdit={handleCancelEdit}
            onChange={updatePlaceFormField}
            onDeleteCurrentPlace={handleDeleteCurrentPlace}
            onSubmit={handleCreatePlace}
            placeForm={placeForm}
            savingPlace={savingPlace}
          />
          <AdminRecentPlacesPanel
            deletingPlaceId={deletingPlaceId}
            onDeletePlace={handleDeletePlace}
            onEditPlace={handleEditPlace}
            places={places}
          />
        </section>
      </article>
    </section>
  );
}
