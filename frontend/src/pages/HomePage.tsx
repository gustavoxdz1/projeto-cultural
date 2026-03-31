import { useEffect, useState } from 'react';
import { PlaceCard } from '../components/PlaceCard';
import { getCategories, getPlaces } from '../services/api';
import type { Category, Place } from '../types/api';

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError('Não foi possível carregar as categorias.'));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPlaces({ search, category, neighborhood })
      .then(setPlaces)
      .catch(() => setError('Não foi possível carregar os locais agora.'))
      .finally(() => setLoading(false));
  }, [search, category, neighborhood]);

  return (
    <section className="portal-page">
      <div className="portal-surface">
        <section className="portal-banner" id="buscar">
          <div className="portal-banner-copy">
            <span className="eyebrow">SpotTech Platform</span>
            <h1>Explore locais com curadoria, organização e participação da comunidade.</h1>
            <p>
              Encontre espaços, refine sua busca por categoria ou bairro e acompanhe uma base
              organizada para descoberta e consulta.
            </p>
          </div>

          <div className="portal-search-row">
            <label className="portal-search">
              <span className="portal-search-icon">⌕</span>
              <input
                placeholder="Buscar locais ou eventos ..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <button className="portal-primary-button" type="button">
              Buscar
            </button>
          </div>

          <div className="portal-filter-row">
            <label className="portal-filter-chip">
              <span>Categoria</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">Todas</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="portal-filter-chip">
              <span>Bairro</span>
              <input
                placeholder="Centro, Adrianópolis"
                value={neighborhood}
                onChange={(event) => setNeighborhood(event.target.value)}
              />
            </label>

            <div className="portal-filter-chip static">
              <span>Popularidade</span>
              <strong>Em alta</strong>
            </div>
          </div>
        </section>

        <section className="portal-highlight-strip">
          <article className="portal-highlight-card">
            <strong>{places.length}</strong>
            <span>Locais disponíveis para consulta</span>
          </article>
          <article className="portal-highlight-card">
            <strong>{categories.length}</strong>
            <span>Categorias organizadas no catálogo</span>
          </article>
          <article className="portal-highlight-card">
            <strong>Curadoria</strong>
            <span>Conteúdo validado e ampliado pela comunidade</span>
          </article>
        </section>

        <section className="portal-content">
          <div className="portal-list-panel" id="espacos">
            <div className="portal-section-heading">
              <h2>Catálogo de locais</h2>
              <small>{places.length} resultado(s)</small>
            </div>

            {loading ? <p className="feedback">Carregando locais...</p> : null}
            {error ? <p className="feedback error">{error}</p> : null}

            {!loading && !error ? (
              <div className="portal-card-grid">
                {places.length > 0 ? (
                  places.map((place) => <PlaceCard key={place.id} place={place} />)
                ) : (
                  <div className="empty-state">
                    <h3>Nenhum local encontrado</h3>
                    <p>Tente ajustar os filtros para ampliar a busca.</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <aside className="portal-map-panel" id="apoio">
            <div className="portal-map-grid">
              <span className="pin pin-a" />
              <span className="pin pin-b" />
              <span className="pin pin-c" />
              <span className="pin pin-d" />
              <span className="pin pin-e" />
            </div>

            <div className="portal-side-copy">
              <span className="eyebrow">Explore smarter</span>
              <h3>Navegação mais clara para encontrar o local certo.</h3>
              <p>
                Use os filtros para reduzir sua busca e abrir os detalhes completos de cada local,
                incluindo endereço, categoria e opções de como chegar.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </section>
  );
}
