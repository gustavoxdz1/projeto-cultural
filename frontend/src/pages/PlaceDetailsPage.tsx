import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlaceById } from '../services/api';
import type { Place } from '../types/api';

export function PlaceDetailsPage() {
  const { id = '' } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPlaceById(id)
      .then(setPlace)
      .catch(() => setError('Não foi possível carregar os detalhes deste local.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="feedback page-feedback">Carregando local...</p>;
  }

  if (error || !place) {
    return (
      <section className="detail-page">
        <p className="feedback error">{error ?? 'Local não encontrado.'}</p>
        <Link className="inline-link" to="/">
          Voltar ao catálogo
        </Link>
      </section>
    );
  }

  const encodedAddress = encodeURIComponent(`${place.name}, ${place.address}, ${place.neighborhood}`);
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&z=15&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const wazeUrl = `https://www.waze.com/ul?q=${encodedAddress}&navigate=yes`;
  const heroImage = place.imageUrl ?? '/images/landing/pordosol-em-ponta-negra.png';
  const searchHint = `${place.name} ${place.neighborhood}`.trim();

  return (
    <section className="detail-page">
      <article className="detail-surface">
        <header
          className="detail-hero"
          style={
            place.imageUrl
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(8, 12, 22, 0.08), rgba(8, 12, 22, 0.82)), url(${heroImage})`,
                }
              : {
                  backgroundImage: `linear-gradient(180deg, rgba(8, 12, 22, 0.12), rgba(8, 12, 22, 0.8)), url(${heroImage})`,
                }
          }
        >
          <div className="detail-overlay">
            <div className="detail-brand">
              <div className="detail-brand-row">
                <img alt="SpotTech" className="detail-brand-logo" src="/images/branding/spottech-logo.png" />
                <div className="detail-brand-copy">
                  <span className="eyebrow light">Guia SpotTech</span>
                  <strong>{place.name}</strong>
                  <p>{place.address}</p>
                </div>
              </div>

              <div className="detail-meta-row">
                <span className="detail-meta-pill">{place.category.name}</span>
                <span className="detail-meta-pill muted">{place.neighborhood}</span>
              </div>
            </div>

            <div className="detail-actions">
              <Link className="detail-back-button" to="/portal">
                <span aria-hidden="true">⟵</span>
                Voltar ao catálogo
              </Link>
            </div>
          </div>
        </header>

        <div className="detail-content">
          <section className="detail-copy">
            <div className="detail-block">
              <h2>Sobre o local</h2>
              <p>{place.description}</p>
              <p>
                Este guia reúne as informações mais úteis para você localizar o espaço com mais rapidez
                e abrir sua rota diretamente no aplicativo que preferir.
              </p>
            </div>

            <div className="detail-block">
              <h2>Informações para encontrar o local</h2>
              <div className="detail-info-grid">
                <article className="detail-info-card">
                  <span>Endereço</span>
                  <strong>{place.address}</strong>
                  <p>Use este endereço como referência principal ao abrir sua rota.</p>
                </article>
                <article className="detail-info-card">
                  <span>Bairro</span>
                  <strong>{place.neighborhood}</strong>
                  <p>Confirmar o bairro ajuda a evitar destinos com nomes parecidos em outras regiões.</p>
                </article>
                <article className="detail-info-card">
                  <span>Categoria</span>
                  <strong>{place.category.name}</strong>
                  <p>Bom para validar se você está indo para o tipo de espaço certo antes da visita.</p>
                </article>
                <article className="detail-info-card">
                  <span>Busca sugerida</span>
                  <strong>{searchHint}</strong>
                  <p>Se precisar compartilhar ou procurar de novo, use esse termo no app de mapas.</p>
                </article>
              </div>
              <div className="directions-actions">
                <a className="primary-button" href={googleMapsUrl} rel="noreferrer" target="_blank">
                  Google Maps
                </a>
                <a className="primary-button" href={wazeUrl} rel="noreferrer" target="_blank">
                  Waze
                </a>
              </div>
            </div>

            <div className="detail-block detail-visit-card">
              <h2>Visitação</h2>
              <p>
                Antes de sair, abra a rota pelo Google Maps ou Waze, confirme o bairro e mantenha o nome
                do local em mãos para facilitar a chegada e o compartilhamento com outras pessoas.
              </p>
              <p>
                Se estiver vindo de outra região da cidade, vale usar o endereço completo como referência
                principal e o nome do local como apoio na busca.
              </p>
            </div>
          </section>

          <aside className="detail-side">
            <div className="detail-map-frame">
              <iframe
                className="detail-map-embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedUrl}
                title={`Mapa de ${place.name}`}
              />
            </div>

            <div className="detail-block">
              <h2>Imagem do local</h2>
              {place.imageUrl ? (
                <div className="detail-image-frame">
                  <img alt={place.name} className="detail-image" src={place.imageUrl} />
                </div>
              ) : (
                <p className="feedback">Este local ainda não possui imagem cadastrada.</p>
              )}
            </div>
          </aside>
        </div>
      </article>
    </section>
  );
}
